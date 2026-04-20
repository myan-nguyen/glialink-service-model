import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

async function getV2Profiles() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('artifacts')
    .select('id, slug, sections')
    .eq('output_type', 'researcher_profile')
    .is('deleted_at', null)
  return { data, error, supabase }
}

// GET — preview which profiles would be updated
export async function GET() {
  const { data: artifacts, error } = await getV2Profiles()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const report = (artifacts ?? []).map((a) => {
    const s = a.sections as Record<string, unknown>
    return {
      id: a.id,
      slug: a.slug,
      isV2: s?._v2 === true,
      hasActiveProjects: !!s?.activeProjects,
      wouldUpdate: s?._v2 === true && !s?.activeProjects,
    }
  })

  return NextResponse.json({ profiles: report })
}

// POST — backfill empty activeProjects for all v2 profiles that lack it.
// Safe to run multiple times.
export async function POST() {
  const { data: artifacts, error, supabase } = await getV2Profiles()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let updated = 0
  let skipped = 0

  for (const artifact of artifacts ?? []) {
    const sections = artifact.sections as Record<string, unknown>
    if (sections?._v2 !== true) { skipped++; continue }
    if (sections.activeProjects)  { skipped++; continue }

    const patched = { ...sections, activeProjects: { content: { projects: [] } } }

    const { error: updateError } = await supabase
      .from('artifacts')
      .update({ sections: patched, updated_at: new Date().toISOString() })
      .eq('id', artifact.id)

    if (updateError) {
      return NextResponse.json(
        { error: `Failed on ${artifact.id}: ${updateError.message}` },
        { status: 500 }
      )
    }

    updated++
  }

  return NextResponse.json({ ok: true, updated, skipped })
}
