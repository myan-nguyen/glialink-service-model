import type { Artifact } from '@/lib/types'
import type { ResearcherProfileV2Sections } from '@/lib/sections/profile-types'
import {
  V2Identity,
  V2AboutAndProject,
  V2TrustStrip,
  V2ResearchAreas,
  V2CurrentFocus,
  V2Keywords,
  V2Expertise,
  V2WhatImOpenTo,
  V2WhatIBring,
  V2ActiveProjects,
  V2Perspective,
  V2Freshness,
  V2PastProjects,
  V2SelectedPublications,
  V2TalksAndAppearances,
  V2WritingAndMedia,
  V2TeachingAndMentorship,
  V2Background,
  V2Education,
  V2CreativeSection,
} from './researcher-v2-sections'
import { CustomSections } from './shared'

const KNOWN_V2_KEYS = new Set([
  '_v2', '_editDraft', 'identity', 'workStatement', 'freshness', 'trustStrip',
  'researchAreas', 'currentFocus', 'keywords', 'expertise', 'whatImOpenTo',
  'whatIBring', 'activeProjects', 'perspective', 'pastProjects',
  'selectedPublications', 'talksAndAppearances', 'writingAndMedia',
  'teachingAndMentorship', 'background', 'education', 'reachOut', 'discoverability',
  'custom_sections',
])

function humanizeKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

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
  const workStatement  = get<Parameters<typeof V2AboutAndProject>[0]['workStatement']>(s, 'workStatement')
  const freshness      = get<Parameters<typeof V2Freshness>[0]['content']>(s, 'freshness')
  const trustStrip     = get<Parameters<typeof V2TrustStrip>[0]['content']>(s, 'trustStrip')
  const researchAreas  = get<Parameters<typeof V2ResearchAreas>[0]['content']>(s, 'researchAreas')
  const currentFocus   = get<Parameters<typeof V2CurrentFocus>[0]['content']>(s, 'currentFocus')
  const keywords       = get<Parameters<typeof V2Keywords>[0]['content']>(s, 'keywords')
  const expertise      = get<Parameters<typeof V2Expertise>[0]['content']>(s, 'expertise')
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

  const hasTwoColRow = whatImOpenTo || whatIBring

  return (
    <article className="min-h-screen bg-white">
      {identity && <V2Identity content={identity} />}

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4 pb-16">
        {/* Row 1: About + Selected Project */}
        {workStatement && (
          <V2AboutAndProject
            workStatement={workStatement}
            activeProjects={activeProjects}
          />
        )}

        {/* Row 2: Research Areas / Current Focus / Keywords */}
        <div className="grid grid-cols-3 gap-4 items-stretch">
          {researchAreas
            ? <V2ResearchAreas content={researchAreas} />
            : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />
          }
          {currentFocus
            ? <V2CurrentFocus content={currentFocus} />
            : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />
          }
          {keywords
            ? <V2Keywords content={keywords} />
            : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />
          }
        </div>

        {/* Row 3: Expertise */}
        {expertise && <V2Expertise content={expertise} />}

        {/* Row 4: What I'm Looking For + What I Offer */}
        {hasTwoColRow && (
          <div className="grid grid-cols-2 gap-4 items-stretch">
            {whatImOpenTo
              ? <V2WhatImOpenTo content={whatImOpenTo} slug={artifact.slug} />
              : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />
            }
            {whatIBring
              ? <V2WhatIBring content={whatIBring} />
              : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />
            }
          </div>
        )}

        {/* Row 5: Selected Projects */}
        {activeProjects && <V2ActiveProjects content={activeProjects} />}

        {/* Row 6: Affiliations */}
        {trustStrip && <V2TrustStrip content={trustStrip} />}

        {/* Row 7: Perspective */}
        {perspective && <V2Perspective content={perspective} />}

        {/* Tier 3 */}
        {pastProjects && <V2PastProjects content={pastProjects} />}
        {selectedPubs && <V2SelectedPublications content={selectedPubs} />}
        {talks && <V2TalksAndAppearances content={talks} />}
        {writing && <V2WritingAndMedia content={writing} />}
        {teaching && <V2TeachingAndMentorship content={teaching} />}
        {background && <V2Background content={background} />}
        {education && <V2Education content={education} />}

        {/* Creative / custom sections added via suggestions */}
        {Object.entries(s as unknown as Record<string, { content: Record<string, unknown> }>)
          .filter(([key]) => !KNOWN_V2_KEYS.has(key))
          .map(([key, entry]) => {
            const c = entry?.content as { paragraphs?: string[]; _sectionLabel?: string } | undefined
            if (!c?.paragraphs?.length) return null
            const label = c._sectionLabel ?? humanizeKey(key)
            return (
              <V2CreativeSection
                key={key}
                label={label}
                content={{ paragraphs: c.paragraphs }}
                sectionKey={key}
              />
            )
          })}

        {/* Custom sections from DraftEditor (array format) */}
        <CustomSections
          sections={((s as unknown as Record<string, unknown>).custom_sections as Array<{ id: string; title: string; content: string }>) ?? []}
        />

        {freshness && <V2Freshness content={freshness} />}
      </div>
    </article>
  )
}
