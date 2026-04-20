import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import { anthropic, fetchUploadedFiles, parseGenerationResponse } from '@/lib/generation'
import { PROJECT_PAGE_SYSTEM } from '@/lib/prompts/project-page'
import { RESEARCHER_PROFILE_SYSTEM } from '@/lib/prompts/researcher-profile'
import { LAB_PROFILE_SYSTEM } from '@/lib/prompts/lab-profile'

export const maxDuration = 60

const SYSTEM_PROMPTS: Record<string, string> = {
  project_page: PROJECT_PAGE_SYSTEM,
  researcher_profile: RESEARCHER_PROFILE_SYSTEM,
  lab_profile: LAB_PROFILE_SYSTEM,
}

export async function POST(request: NextRequest) {
  const { artifact_id } = await request.json()

  if (!artifact_id) {
    return NextResponse.json({ error: 'artifact_id is required' }, { status: 422 })
  }

  const supabase = createServiceClient()

  const { data: artifact, error } = await supabase
    .from('artifacts')
    .select('*, researchers(*)')
    .eq('id', artifact_id)
    .single()

  if (error || !artifact) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
  }

  await supabase
    .from('artifacts')
    .update({ generation_status: 'generating', generation_error: null })
    .eq('id', artifact_id)

  waitUntil(regenerate(artifact_id, artifact))

  return NextResponse.json({ ok: true })
}

async function regenerate(
  artifactId: string,
  artifact: Record<string, unknown>
) {
  const supabase = createServiceClient()

  try {
    const researcher = artifact.researchers as Record<string, unknown>
    const intakeData = artifact.intake_data as Record<string, unknown>

    const filePaths = (intakeData.file_uploads as string[]) ?? []
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
      supplemental_links: researcher.supplemental_links ?? [],
      ...intakeData,
    }
    delete intakeJson.file_uploads

    const outputType = artifact.output_type as string
    const systemPrompt = SYSTEM_PROMPTS[outputType]
    if (!systemPrompt) throw new Error(`Unknown output type: ${outputType}`)

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
      outputType === 'researcher_profile'
        ? { _v2: true, ...sections }
        : sections

    await supabase
      .from('artifacts')
      .update({
        sections: sectionsToStore,
        page_readiness: page_readiness ?? null,
        generation_status: 'complete',
        generation_error: null,
      })
      .eq('id', artifactId)

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase
      .from('artifacts')
      .update({ generation_status: 'failed', generation_error: message })
      .eq('id', artifactId)
  }
}
