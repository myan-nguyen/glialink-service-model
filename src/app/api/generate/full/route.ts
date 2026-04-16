import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import {
  anthropic,
  fetchUploadedFiles,
  parseGenerationResponse,
} from '@/lib/generation'
import { PROJECT_PAGE_SYSTEM } from '@/lib/prompts/project-page'
import { RESEARCHER_PROFILE_SYSTEM } from '@/lib/prompts/researcher-profile'
import { LAB_PROFILE_SYSTEM } from '@/lib/prompts/lab-profile'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPTS: Record<string, string> = {
  project_page: PROJECT_PAGE_SYSTEM,
  researcher_profile: RESEARCHER_PROFILE_SYSTEM,
  lab_profile: LAB_PROFILE_SYSTEM,
}

export const maxDuration = 60 // Vercel max for Pro plan

export async function POST(request: NextRequest) {
  const { artifact_id, researcher, artifact } = await request.json()
  const supabase = createServiceClient()

  // Mark as generating
  await supabase
    .from('artifacts')
    .update({ generation_status: 'generating' })
    .eq('id', artifact_id)

  try {
    // Fetch uploaded files from Supabase Storage
    const filePaths = (artifact.intake_data.file_uploads as string[]) ?? []
    const fileBlocks = await fetchUploadedFiles(filePaths)

    // Build intake JSON for Claude (researcher identity + output-specific fields)
    const intakeJson = {
      // Researcher identity
      full_name: researcher.full_name,
      institution: researcher.institution,
      department_or_lab: researcher.department_or_lab,
      role_career_stage: researcher.role_career_stage,
      field_and_subfield: researcher.field_and_subfield,
      plain_language_research_description: researcher.plain_language_research_description,
      ai_comfort: researcher.ai_comfort,
      additional_notes: researcher.additional_notes,
      // Output-specific fields
      ...artifact.intake_data,
    }

    // Remove file_uploads from the JSON sent to Claude —
    // the actual files are already included as document/image blocks
    delete intakeJson.file_uploads

    // Build user message content
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
    if (!systemPrompt) {
      throw new Error(`Unknown output type: ${artifact.output_type}`)
    }

    // Call Claude
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
      // Retry once with a stricter prompt
      const retryResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userContent },
          { role: 'assistant', content: rawText },
          {
            role: 'user',
            content: 'Your response was not valid JSON. Return only the raw JSON object, nothing else. No markdown, no backticks, no explanation.'
          },
        ],
      })

      const retryText = retryResponse.content
        .filter(b => b.type === 'text')
        .map(b => (b as Anthropic.Messages.TextBlock).text)
        .join('')

      parsed = parseGenerationResponse(retryText)
    }

    // Separate page_readiness from sections
    const { page_readiness, ...sections } = parsed

    // Write sections to artifact
    await supabase
      .from('artifacts')
      .update({
        sections,
        page_readiness: page_readiness ?? null,
        generation_status: 'complete',
        generation_error: null,
      })
      .eq('id', artifact_id)

    return NextResponse.json({ ok: true })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown generation error'

    await supabase
      .from('artifacts')
      .update({
        generation_status: 'failed',
        generation_error: message,
      })
      .eq('id', artifact_id)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}