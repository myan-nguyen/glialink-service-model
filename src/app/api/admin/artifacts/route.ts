import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artifacts')
    .select(`
      id,
      output_type,
      status,
      slug,
      generation_status,
      created_at,
      updated_at,
      published_at,
      deleted_at,
      researchers (
        full_name,
        email,
        institution,
        department_or_lab
      )
    `)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ artifacts: data })
}