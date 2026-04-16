import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params
  const supabase = await createClient()
  const now = new Date().toISOString()

  // Soft-delete all artifacts for this researcher first
  const { error: artifactsError } = await supabase
    .from('artifacts')
    .update({ deleted_at: now })
    .eq('researcher_email', decodeURIComponent(email))
    .is('deleted_at', null)

  if (artifactsError) {
    return NextResponse.json({ error: artifactsError.message }, { status: 500 })
  }

  // Soft-delete the researcher
  const { error: researcherError } = await supabase
    .from('researchers')
    .update({ deleted_at: now })
    .eq('email', decodeURIComponent(email))

  if (researcherError) {
    return NextResponse.json({ error: researcherError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}