import { notFound, redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { ResearcherProfileEditor } from '@/components/editor/ResearcherProfileEditor'
import type { Artifact, Researcher } from '@/lib/types'
import type { ResearcherProfileV2Sections, EditDraft } from '@/lib/sections/profile-types'

export default async function ResearcherProfileEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { slug } = await params
  const { token } = await searchParams

  const editToken = process.env.PROFILE_EDIT_TOKEN
  if (!editToken || token !== editToken) {
    redirect(`/p/${slug}`)
  }

  const supabase = createServiceClient()

  const { data: artifact, error } = await supabase
    .from('artifacts')
    .select('*, researchers(*)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (error || !artifact) notFound()

  const sections = artifact.sections as unknown as ResearcherProfileV2Sections

  if (sections?._v2 !== true) {
    // Not a v2 profile — redirect to public page
    redirect(`/p/${slug}`)
  }

  const { _editDraft, _v2, ...publishedSections } = sections as Record<string, unknown> & {
    _v2: true
    _editDraft?: EditDraft | null
  }

  const researcher = (artifact as Artifact & { researchers: Researcher }).researchers
  const researcherName = researcher?.full_name ?? artifact.researcher_email

  const pageReadiness = (artifact as Artifact).page_readiness

  return (
    <ResearcherProfileEditor
      slug={slug}
      artifactId={artifact.id}
      initialSections={publishedSections as Record<string, unknown>}
      initialDraft={_editDraft ?? null}
      researcherName={researcherName}
      initialSuggestions={pageReadiness?.section_suggestions ?? []}
    />
  )
}
