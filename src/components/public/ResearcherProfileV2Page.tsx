import type { Artifact } from '@/lib/types'
import type { ResearcherProfileV2Sections } from '@/lib/sections/profile-types'
import {
  V2Identity,
  V2WorkStatement,
  V2TrustStrip,
  V2WhatImOpenTo,
  V2WhatIBring,
  V2ActiveProjects,
  V2Perspective,
  V2Freshness,
  V2ReachOut,
  V2PastProjects,
  V2SelectedPublications,
  V2TalksAndAppearances,
  V2WritingAndMedia,
  V2TeachingAndMentorship,
  V2Background,
  V2Education,
} from './researcher-v2-sections'

function get<T>(
  sections: ResearcherProfileV2Sections,
  key: keyof ResearcherProfileV2Sections
): T | null {
  const entry = sections[key] as { content: T } | undefined | null
  return entry?.content ?? null
}

export function ResearcherProfileV2Page({
  artifact,
}: {
  artifact: Artifact & { slug: string }
}) {
  const s = artifact.sections as unknown as ResearcherProfileV2Sections

  const identity       = get<Parameters<typeof V2Identity>[0]['content']>(s, 'identity')
  const workStatement  = get<Parameters<typeof V2WorkStatement>[0]['content']>(s, 'workStatement')
  const freshness      = get<Parameters<typeof V2Freshness>[0]['content']>(s, 'freshness')
  const trustStrip     = get<Parameters<typeof V2TrustStrip>[0]['content']>(s, 'trustStrip')
  const whatImOpenTo   = get<Parameters<typeof V2WhatImOpenTo>[0]['content']>(s, 'whatImOpenTo')
  const whatIBring     = get<Parameters<typeof V2WhatIBring>[0]['content']>(s, 'whatIBring')
  const activeProjects = get<Parameters<typeof V2ActiveProjects>[0]['content']>(s, 'activeProjects')
  const perspective    = get<Parameters<typeof V2Perspective>[0]['content']>(s, 'perspective')
  const pastProjects   = get<Parameters<typeof V2PastProjects>[0]['content']>(s, 'pastProjects')
  const selectedPubs   = get<Parameters<typeof V2SelectedPublications>[0]['content']>(s, 'selectedPublications')
  const talks          = get<Parameters<typeof V2TalksAndAppearances>[0]['content']>(s, 'talksAndAppearances')
  const writing        = get<Parameters<typeof V2WritingAndMedia>[0]['content']>(s, 'writingAndMedia')
  const teaching       = get<Parameters<typeof V2TeachingAndMentorship>[0]['content']>(s, 'teachingAndMentorship')
  const background     = get<Parameters<typeof V2Background>[0]['content']>(s, 'background')
  const education      = get<Parameters<typeof V2Education>[0]['content']>(s, 'education')

  return (
    <article className="min-h-screen bg-surface-tint">
      {identity && <V2Identity content={identity} />}

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4 pb-16">
        {workStatement && <V2WorkStatement content={workStatement} />}
        {trustStrip && <V2TrustStrip content={trustStrip} />}
        {whatImOpenTo && <V2WhatImOpenTo content={whatImOpenTo} slug={artifact.slug} />}
        {whatIBring && <V2WhatIBring content={whatIBring} />}
        {activeProjects && <V2ActiveProjects content={activeProjects} />}
        {perspective && <V2Perspective content={perspective} />}
        {pastProjects && <V2PastProjects content={pastProjects} />}
        {selectedPubs && <V2SelectedPublications content={selectedPubs} />}
        {talks && <V2TalksAndAppearances content={talks} />}
        {writing && <V2WritingAndMedia content={writing} />}
        {teaching && <V2TeachingAndMentorship content={teaching} />}
        {background && <V2Background content={background} />}
        {education && <V2Education content={education} />}
        {freshness && <V2Freshness content={freshness} />}
        <V2ReachOut slug={artifact.slug} />
      </div>
    </article>
  )
}
