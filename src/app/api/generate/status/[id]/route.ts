import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artifacts')
    .select('generation_status, generation_error, sections, page_readiness')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
  }

  return NextResponse.json({
    generation_status: data.generation_status,
    generation_error: data.generation_error,
    // Only include sections once complete — avoids sending partial data
    sections: data.generation_status === 'complete' ? data.sections : null,
    page_readiness: data.generation_status === 'complete' ? data.page_readiness : null,
  })
}