import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { OutputType } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 30

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

  return NextResponse.json({ artifact_id: artifactRow.id }, { status: 201 })
}
