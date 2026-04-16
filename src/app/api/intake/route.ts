import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import type { OutputType } from '@/lib/types'

// Required fields by output type
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

  // 1. Upsert researcher (create or update by email)
  const { error: upsertError } = await supabase
    .from('researchers')
    .upsert(
      {
        ...researcher,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  // 2. Create artifact record (draft, no sections yet)
  const { data: artifactRow, error: artifactError } = await supabase
    .from('artifacts')
    .insert({
      researcher_email: researcher.email,
      output_type: artifact.output_type as OutputType,
      intake_data: artifact.intake_data,
      status: 'draft',
    })
    .select()
    .single()

  if (artifactError) {
    // Handle uniqueness violation for researcher_profile / lab_profile
    if (artifactError.code === '23505') {
      return NextResponse.json(
        {
          error: `A ${artifact.output_type.replace('_', ' ')} already exists for this researcher.
                  Delete or edit the existing one first.`
        },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: artifactError.message }, { status: 500 })
  }

  // 3. Trigger generation (async — do not await in the response)
  //    We kick off generation in the background and redirect immediately.
  //    The editor will poll for sections once it loads.
  triggerGeneration(artifactRow.id, researcher, artifact).catch(console.error)

  return NextResponse.json({ artifact_id: artifactRow.id }, { status: 201 })
}

// Background generation trigger
async function triggerGeneration(
  artifactId: string,
  researcher: Record<string, unknown>,
  artifact: { output_type: string; intake_data: Record<string, unknown> }
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  await fetch(`${baseUrl}/api/generate/full`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artifact_id: artifactId, researcher, artifact }),
  })
}