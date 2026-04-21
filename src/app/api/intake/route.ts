import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { waitUntil } from '@vercel/functions'
import type { OutputType } from '@/lib/types'
import { createServiceClient } from '@/lib/supabase/service'
import { anthropic, fetchUploadedFiles, parseGenerationResponse } from '@/lib/generation'
import { PROJECT_PAGE_SYSTEM } from '@/lib/prompts/project-page'
import { RESEARCHER_PROFILE_SYSTEM } from '@/lib/prompts/researcher-profile'
import { LAB_PROFILE_SYSTEM } from '@/lib/prompts/lab-profile'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPTS: Record<string, string> = {
  project_page: PROJECT_PAGE_SYSTEM,
  researcher_profile: RESEARCHER_PROFILE_SYSTEM,
  lab_profile: LAB_PROFILE_SYSTEM,
}

export const maxDuration = 60

function validateIntake(
  researcher: Record<string, unknown>,
  artifact: { output_type: string; intake_data: Record<string, unknown> }
): string | null {
  if (!researcher.email) return 'Email is required'
  if (!artifact.output_type) return 'Output type is required'
  if (!researcher.full_name) return 'Full name is required'
  if (!researcher.plain_language_research_description)
    return 'Plain-language research description is required'
  if (artifact.output_type === 'project_page') {
    if (!artifact.intake_data.project_title) return 'Project title is required'
    if (!artifact.intake_data.active_project_description)
      return 'Active project description is required'
  }
  if (artifact.output_type === 'lab_profile') {
    if (!artifact.intake_data.lab_name) return 'Lab name is required'
  }
  return null
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { researcher, artifact } = body

  const validationError = validateIntake(researcher, artifact)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 })
  }

  const supabase = await createClient()

  // supplemental_links belongs to the artifact, not the researcher row
  const { supplemental_links, ...researcherRow } = researcher as Record<string, unknown> & { supplemental_links?: unknown }

  const { error: upsertError } = await supabase
    .from('researchers')
    .upsert(
      { ...researcherRow, updated_at: new Date().toISOString() },
      { onConflict: 'email' }
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  const intakeDataWithLinks = {
    ...artifact.intake_data,
    ...(supplemental_links !== undefined ? { supplemental_links } : {}),
  }

  const { data: artifactRow, error: artifactError } = await supabase
    .from('artifacts')
    .insert({
      researcher_email: researcher.email,
      output_type: artifact.output_type as OutputType,
      intake_data: intakeDataWithLinks,
      status: 'draft',
      generation_status: 'pending',
    })
    .select()
    .single()

  if (artifactError) {
    if (artifactError.code === '23505') {
      return NextResponse.json(
        {
          error: `A ${artifact.output_type.replace(/_/g, ' ')} already exists for this
                  researcher. Delete or edit the existing one first.`
        },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: artifactError.message }, { status: 500 })
  }

  waitUntil(triggerGeneration(artifactRow.id, researcher, { ...artifact, intake_data: intakeDataWithLinks }))

  return NextResponse.json({ artifact_id: artifactRow.id }, { status: 201 })
}

async function triggerGeneration(
  artifactId: string,
  researcher: Record<string, unknown>,
  artifact: { output_type: string; intake_data: Record<string, unknown> }
) {
  const supabase = createServiceClient()

  await supabase
    .from('artifacts')
    .update({ generation_status: 'generating' })
    .eq('id', artifactId)

  try {
    const filePaths = (artifact.intake_data.file_uploads as string[]) ?? []
    const fileBlocks = await fetchUploadedFiles(filePaths)

    const intakeJson: Record<string, unknown> = {
      full_name: researcher.full_name,
      institution: researcher.institution,
      department_or_lab: researcher.department_or_lab,
      role_career_stage: researcher.role_career_stage,
      field_and_subfield: researcher.field_and_subfield,
      plain_language_research_description: researcher.plain_language_research_description,
      ai_comfort: researcher.ai_comfort,
      additional_notes: researcher.additional_notes,
      supplemental_links: artifact.intake_data.supplemental_links ?? [],
      ...artifact.intake_data,
    }
    delete intakeJson.file_uploads

    const userContent: Anthropic.Messages.ContentBlockParam[] = [
      {
        type: 'text',
        text: `Here is the researcher's intake form:\n\n${JSON.stringify(intakeJson, null, 2)}`,
      },
      ...fileBlocks,
      {
        type: 'text',
        text: 'Generate the structured output JSON now. Return only valid JSON, nothing else.',
      },
    ]

    const systemPrompt = SYSTEM_PROMPTS[artifact.output_type]
    if (!systemPrompt) throw new Error(`Unknown output type: ${artifact.output_type}`)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    const rawText = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as Anthropic.Messages.TextBlock).text)
      .join('')

    let parsed: Record<string, unknown>
    try {
      parsed = parseGenerationResponse(rawText)
    } catch {
      const retry = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userContent },
          { role: 'assistant', content: rawText },
          { role: 'user', content: 'Return only valid JSON. No markdown, no backticks.' },
        ],
      })
      parsed = parseGenerationResponse(
        retry.content.filter(b => b.type === 'text')
          .map(b => (b as Anthropic.Messages.TextBlock).text).join('')
      )
    }

    const { page_readiness, ...sections } = parsed
    const sectionsToStore =
      artifact.output_type === 'researcher_profile'
        ? { _v2: true, ...sections }
        : sections

    await supabase
      .from('artifacts')
      .update({ sections: sectionsToStore, page_readiness: page_readiness ?? null, generation_status: 'complete', generation_error: null })
      .eq('id', artifactId)

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase
      .from('artifacts')
      .update({ generation_status: 'failed', generation_error: message })
      .eq('id', artifactId)
  }
}