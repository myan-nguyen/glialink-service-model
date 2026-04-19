import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { PublicPage } from '@/components/public/PublicPage'
import { ShareBanner } from '@/components/public/ShareBanner'
import { CTAFooter } from '@/components/public/CTAFooter'
import type { Artifact } from '@/lib/types'

export const revalidate = 60

export default async function PublicArtifactPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createServiceClient()

  const { data: artifact, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single()

  if (error || !artifact) notFound()

  const sections = artifact.sections as Record<
    string,
    { content: Record<string, unknown> }
  >
  const ctaContent = sections?.cta?.content as Record<string, string> | undefined
  const ctaText = ctaContent?.call_to_action

  return (
    <div className="animate-fade-in">
      <ShareBanner slug={slug} />
      <PublicPage artifact={artifact as Artifact} />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-12">
        <CTAFooter ctaText={ctaText} />
      </div>
    </div>
  )
}