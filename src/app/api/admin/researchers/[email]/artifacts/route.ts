import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params
  const supabase = await createClient()
  const decoded = decodeURIComponent(email)

  const { data: researcher, error: rError } = await supabase
    .from('researchers')
    .select('*')
    .eq('email', decoded)
    .is('deleted_at', null)
    .single()

  if (rError || !researcher) {
    return NextResponse.json({ error: 'Researcher not found' }, { status: 404 })
  }

  const { data: artifacts, error: aError } = await supabase
    .from('artifacts')
    .select('id, output_type, status, slug, generation_status, created_at, updated_at')
    .eq('researcher_email', decoded)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (aError) {
    return NextResponse.json({ error: aError.message }, { status: 500 })
  }

  return NextResponse.json({ researcher, artifacts })
}