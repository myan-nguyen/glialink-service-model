import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { EditDraft } from '@/lib/sections/profile-types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  let draft: EditDraft
  try {
    const body = await request.json()
    draft = body.draft
    if (!draft || !Array.isArray(draft.activeSections)) {
      return NextResponse.json({ error: 'Invalid draft payload' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: artifact, error: fetchError } = await supabase
    .from('artifacts')
    .select('id, sections')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (fetchError || !artifact) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
  }

  const existing = artifact.sections as Record<string, unknown>
  if (existing?._v2 !== true) {
    return NextResponse.json({ error: 'Not a v2 profile' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('artifacts')
    .update({
      sections: { ...existing, _editDraft: draft },
      updated_at: new Date().toISOString(),
    })
    .eq('id', artifact.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
