import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { sections, custom_sections } = await request.json()
  const supabase = await createClient()

  // Merge custom sections into sections object
  const sectionsToSave = {
    ...sections,
    ...(custom_sections?.length ? { custom_sections } : {}),
  }

  const { error } = await supabase
    .from('artifacts')
    .update({ sections: sectionsToSave })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}