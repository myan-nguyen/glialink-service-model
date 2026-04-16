import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

function generateSlug(fullName: string, outputType: string): string {
  const nameSlug = (fullName ?? 'researcher')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  const typeSlug = outputType.replace(/_/g, '-')
  return `${nameSlug}-${typeSlug}-${nanoid(6)}`
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { sections, custom_sections, researcher_name } = await request.json()
  const supabase = await createClient()

  // Fetch artifact to get output_type and existing slug
  const { data: artifact, error: fetchError } = await supabase
    .from('artifacts')
    .select('slug, output_type')
    .eq('id', id)
    .single()

  if (fetchError || !artifact) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
  }

  const slug = artifact.slug ?? generateSlug(researcher_name, artifact.output_type)

  const sectionsToSave = {
    ...sections,
    ...(custom_sections?.length ? { custom_sections } : {}),
  }

  const { error } = await supabase
    .from('artifacts')
    .update({
      sections: sectionsToSave,
      status: 'published',
      slug,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ slug })
}