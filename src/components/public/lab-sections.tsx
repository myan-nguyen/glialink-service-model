import {
  SectionLabel,
  Prose,
  TagList,
  BulletList,
  Pullquote,
  InlineMeta,
  StatusPill,
} from './primitives'

function LabCard({
  label,
  title,
  children,
  accent = false,
}: {
  label?: string
  title?: string
  children: React.ReactNode
  accent?: boolean
}) {
  return (
    <section
      className={`border rounded-2xl p-6 sm:p-8 ${
        accent
          ? 'bg-brand-mist/60 border-brand-soft/30'
          : 'bg-canvas-soft border-canvas-border'
      }`}
    >
      {label && (
        <p className="text-[11px] font-sans font-semibold tracking-[0.18em]
                      uppercase text-brand mb-2">
          {label}
        </p>
      )}
      {title && (
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink
                       leading-tight mb-5">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

export function LabHero({ content }: { content: Record<string, string> }) {
  const initials = (content.lab_name || '')
    .split(' ')
    .filter((w) => !['lab', 'laboratory', 'the', 'of', 'for'].includes(w.toLowerCase()))
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="py-8 sm:py-12 animate-fade-up">
      <div className="bg-canvas-soft border border-canvas-border rounded-2xl
                      p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br
                          from-brand to-brand-deep flex items-center justify-center
                          shrink-0 shadow-sm">
            <span className="text-2xl sm:text-3xl font-display font-bold text-white">
              {initials || '◆'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-sans font-semibold tracking-[0.18em]
                          uppercase text-brand mb-2">
              Lab profile
            </p>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl
                           font-bold text-ink leading-tight mb-2 tracking-tight">
              {content.lab_name || 'Lab'}
            </h1>
            <InlineMeta
              items={[
                content.pi_name ? `PI: ${content.pi_name}` : null,
                content.lab_lead_role,
                content.institution,
                content.department,
              ]}
            />
            {content.field_and_subfield && (
              <p className="mt-3 inline-block text-xs font-sans font-semibold
                            tracking-wide text-brand-deep bg-brand-mist
                            px-3 py-1 rounded-full">
                {content.field_and_subfield}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function LabSummary({ content }: { content: Record<string, string> }) {
  const hasAny =
    content.one_sentence_lab_summary ||
    content.lab_mission_statement ||
    content.why_the_lab_exists
  if (!hasAny) return null
  return (
    <LabCard label="About the lab">
      <div className="space-y-4 max-w-[680px]">
        {content.one_sentence_lab_summary && (
          <p className="font-display text-lg sm:text-xl text-ink leading-snug">
            {content.one_sentence_lab_summary}
          </p>
        )}
        {content.lab_mission_statement && (
          <Prose>{content.lab_mission_statement}</Prose>
        )}
        {content.why_the_lab_exists && (
          <Prose className="text-ink-muted">{content.why_the_lab_exists}</Prose>
        )}
      </div>
    </LabCard>
  )
}

export function ResearchAreas({
  content,
}: {
  content: { core_research_areas?: string[] }
}) {
  if (!content.core_research_areas?.length) return null
  return (
    <LabCard label="Research areas" title="What we study">
      <TagList tags={content.core_research_areas} />
    </LabCard>
  )
}

export function CurrentDirections({
  content,
}: {
  content: { active_directions?: string[] }
}) {
  if (!content.active_directions?.length) return null
  return (
    <LabCard label="Active work" title="Current directions">
      <div className="max-w-[680px]">
        <BulletList items={content.active_directions} />
      </div>
    </LabCard>
  )
}

export function FlagshipProjects({
  content,
}: {
  content: {
    projects?: Array<{
      project_title: string
      short_description: string
      current_status: string
    }>
  }
}) {
  if (!content.projects?.length) return null
  return (
    <LabCard label="Projects" title="Flagship work">
      <div className="divide-y divide-canvas-border">
        {content.projects.map((p, i) => (
          <div
            key={i}
            className={`${i === 0 ? 'pb-5' : 'py-5'} ${i === content.projects!.length - 1 ? 'pb-0' : ''} space-y-1.5`}
          >
            <h3 className="font-display text-base font-semibold text-ink">
              {p.project_title}
            </h3>
            {p.short_description && (
              <p className="text-sm text-ink-light leading-relaxed">
                {p.short_description}
              </p>
            )}
            {p.current_status && (
              <p className="text-xs text-brand font-sans font-medium">
                {p.current_status}
              </p>
            )}
          </div>
        ))}
      </div>
    </LabCard>
  )
}

export function Capabilities({
  content,
}: {
  content: {
    methods_capabilities?: string[]
    datasets_tools_infrastructure?: string[]
  }
}) {
  const hasMethods = content.methods_capabilities?.length
  const hasInfra = content.datasets_tools_infrastructure?.length
  if (!hasMethods && !hasInfra) return null

  return (
    <LabCard label="Capabilities" title="Methods & infrastructure">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasMethods && (
          <div>
            <p className="text-xs font-sans font-semibold tracking-wide
                          uppercase text-ink-muted mb-3">
              Methods
            </p>
            <BulletList items={content.methods_capabilities!} />
          </div>
        )}
        {hasInfra && (
          <div>
            <p className="text-xs font-sans font-semibold tracking-wide
                          uppercase text-ink-muted mb-3">
              Infrastructure
            </p>
            <BulletList items={content.datasets_tools_infrastructure!} />
          </div>
        )}
      </div>
    </LabCard>
  )
}

export function TeamFit({ content }: { content: Record<string, string> }) {
  const hasAny =
    content.who_belongs_here ||
    content.lab_culture ||
    content.mentorship_environment
  if (!hasAny) return null

  return (
    <LabCard label="Team & culture" title="Who belongs here">
      <div className="space-y-6 max-w-[680px]">
        {content.who_belongs_here && (
          <div>
            <p className="text-xs font-sans font-semibold tracking-wide
                          uppercase text-ink-muted mb-2">
              Ideal fit
            </p>
            <Prose>{content.who_belongs_here}</Prose>
          </div>
        )}
        {content.lab_culture && (
          <div>
            <p className="text-xs font-sans font-semibold tracking-wide
                          uppercase text-ink-muted mb-2">
              Lab culture
            </p>
            <Prose>{content.lab_culture}</Prose>
          </div>
        )}
        {content.mentorship_environment && (
          <div>
            <p className="text-xs font-sans font-semibold tracking-wide
                          uppercase text-ink-muted mb-2">
              Mentorship
            </p>
            <Prose>{content.mentorship_environment}</Prose>
          </div>
        )}
      </div>
    </LabCard>
  )
}

export function Opportunities({
  content,
}: {
  content: { recruiting_status?: string; open_opportunities?: string[] }
}) {
  if (!content.recruiting_status && !content.open_opportunities?.length)
    return null
  return (
    <LabCard label="Open opportunities" title="Currently recruiting" accent>
      <div className="space-y-5 max-w-[680px]">
        {content.recruiting_status && (
          <StatusPill text={content.recruiting_status} />
        )}
        {content.open_opportunities?.length && (
          <div className="space-y-3">
            {content.open_opportunities.map((opp, i) => (
              <div
                key={i}
                className="bg-canvas border border-canvas-border rounded-xl
                           p-4 flex items-start gap-3"
              >
                <span className="text-[10px] font-sans font-semibold
                                 tracking-wider uppercase text-ink-subtle
                                 shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm text-ink-light leading-relaxed flex-1">
                  {opp}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </LabCard>
  )
}

export function LabAsks({ content }: { content: Record<string, string> }) {
  const hasAny =
    content.specific_needs_asks || content.best_fit_people_or_partners
  if (!hasAny) return null
  return (
    <LabCard label="Collaboration asks" title="Beyond recruiting">
      <div className="space-y-3 max-w-[680px]">
        {content.specific_needs_asks && <Prose>{content.specific_needs_asks}</Prose>}
        {content.best_fit_people_or_partners && (
          <p className="text-sm text-ink-muted font-sans pt-2
                        border-t border-canvas-border">
            <span className="font-semibold text-ink-light">Best fit: </span>
            {content.best_fit_people_or_partners}
          </p>
        )}
      </div>
    </LabCard>
  )
}

export function WhatTheLabOffers({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.offer_description) return null
  return (
    <LabCard label="What the lab offers" title="Training & support">
      <Prose className="max-w-[680px]">{content.offer_description}</Prose>
    </LabCard>
  )
}

export function ProofVisibility({
  content,
}: {
  content: {
    selected_publications_or_outputs?: Array<{
      type: string
      title: string
      url?: string | null
    }>
    research_tags?: string[]
    website_links?: string[]
  }
}) {
  const hasOutputs = content.selected_publications_or_outputs?.length
  const hasTags = content.research_tags?.length
  const hasLinks = content.website_links?.length
  if (!hasOutputs && !hasTags && !hasLinks) return null

  return (
    <LabCard label="Proof & visibility" title="Recent output">
      {hasOutputs && (
        <div className="mb-6 divide-y divide-canvas-border">
          {content.selected_publications_or_outputs!.map((o, i) => (
            <div
              key={i}
              className={`${i === 0 ? 'pb-4' : 'py-4'} ${i === content.selected_publications_or_outputs!.length - 1 ? 'pb-0' : ''} flex items-start gap-4`}
            >
              <span className="text-[10px] font-sans font-semibold
                               tracking-wider uppercase text-brand mt-1
                               w-16 shrink-0">
                {o.type}
              </span>
              {o.url ? (
                <a
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink hover:text-brand-deep
                             underline underline-offset-2
                             decoration-canvas-border hover:decoration-brand
                             transition-colors flex-1"
                >
                  {o.title}
                </a>
              ) : (
                <p className="text-sm text-ink flex-1">{o.title}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {hasTags && (
        <div className="mb-5">
          <TagList tags={content.research_tags!} />
        </div>
      )}
      {hasLinks && (
        <div className="space-y-1.5">
          {content.website_links!.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-brand hover:text-brand-deep
                         underline underline-offset-2 transition-colors break-all"
            >
              {url}
            </a>
          ))}
        </div>
      )}
    </LabCard>
  )
}

export function LabHumanLayer({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.pi_or_lab_perspective_quote) return null
  return (
    <LabCard label="From the PI">
      <Pullquote
        quote={content.pi_or_lab_perspective_quote}
        attribution={content.why_this_lab_cares_about_this_problem}
      />
    </LabCard>
  )
}