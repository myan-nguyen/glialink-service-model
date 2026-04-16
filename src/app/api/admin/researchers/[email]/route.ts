import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { error: artifactsError } = await supabase
    .from('artifacts')
    .update({ deleted_at: now })
    .eq('researcher_email', decodeURIComponent(email))
    .is('deleted_at', null)

  if (artifactsError) {
    return NextResponse.json({ error: artifactsError.message }, { status: 500 })
  }

  const { error: researcherError } = await supabase
    .from('researchers')
    .update({ deleted_at: now })
    .eq('email', decodeURIComponent(email))

  if (researcherError) {
    return NextResponse.json({ error: researcherError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params
  const supabase = await createClient()
  const body = await request.json()

  // Only allow identity-level fields to be updated via this route
  const allowed = [
    'full_name', 'institution', 'department_or_lab', 'role_career_stage',
    'field_and_subfield', 'plain_language_research_description',
    'ai_comfort', 'additional_notes',
  ]

  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  const { error } = await supabase
    .from('researchers')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('email', decodeURIComponent(email))
    .is('deleted_at', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}