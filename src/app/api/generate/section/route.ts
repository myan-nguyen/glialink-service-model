import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import {
  anthropic,
  fetchUploadedFiles,
  parseGenerationResponse,
} from '@/lib/generation'
import { PROJECT_PAGE_SYSTEM } from '@/lib/prompts/project-page'
import { RESEARCHER_PROFILE_SYSTEM } from '@/lib/prompts/researcher-profile'
import { LAB_PROFILE_SYSTEM } from '@/lib/prompts/lab-profile'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPTS: Record<string, string> = {
  project_page: PROJECT_PAGE_SYSTEM,
  researcher_profile: RESEARCHER_PROFILE_SYSTEM,
  lab_profile: LAB_PROFILE_SYSTEM,
}

export async function POST(request: NextRequest) {
  const { artifact_id, section_name } = await request.json()
  const supabase = createServiceClient()

  const { data: artifact, error: artifactError } = await supabase
    .from('artifacts')
    .select('*, researchers(*)')
    .eq('id', artifact_id)
    .single()

  if (artifactError || !artifact) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
  }

  const researcher = (artifact as Record<string, unknown>).researchers as Record<string, unknown>
  const intakeData = artifact.intake_data as Record<string, unknown>

  try {
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
      ...intakeData,
    }
    delete intakeJson.file_uploads

    const systemPrompt = SYSTEM_PROMPTS[artifact.output_type]
    if (!systemPrompt) {
      return NextResponse.json({ error: 'Unknown output type' }, { status: 400 })
    }

    const cachedSystem: Anthropic.Messages.TextBlockParam[] = [
      { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
    ]

    const userContent: Anthropic.Messages.ContentBlockParam[] = [
      {
        type: 'text',
        text: `Here is the researcher's intake form:\n\n${JSON.stringify(intakeJson, null, 2)}`,
      },
      ...fileBlocks,
      {
        type: 'text',
        text: `Regenerate ONLY the "${section_name}" section. Return a JSON object containing only that section key. Nothing else.`,
      },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: cachedSystem,
      messages: [{ role: 'user', content: userContent }],
    })

    const rawText = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as Anthropic.Messages.TextBlock).text)
      .join('')

    const parsed = parseGenerationResponse(rawText)
    const newSectionData = parsed[section_name]

    if (!newSectionData) {
      return NextResponse.json(
        { error: `Section "${section_name}" not found in response` },
        { status: 422 }
      )
    }

    const { data: current } = await supabase
      .from('artifacts')
      .select('sections')
      .eq('id', artifact_id)
      .single()

    const updatedSections = {
      ...(current?.sections as Record<string, unknown> ?? {}),
      [section_name]: newSectionData,
    }

    await supabase
      .from('artifacts')
      .update({ sections: updatedSections })
      .eq('id', artifact_id)

    return NextResponse.json({ section: newSectionData })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Regeneration failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
