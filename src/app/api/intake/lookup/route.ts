import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('researchers')
    .select('*')
    .eq('email', email)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ researcher: data })
}