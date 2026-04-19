import React from 'react'
import { BulletList, TagList, Pullquote, Prose, Quote } from './shared'

// ─── Layout primitives ────────────────────────────────────────────────────────

function Card({
  children,
  sectionKey,
  className = '',
}: {
  children: React.ReactNode
  sectionKey?: string
  className?: string
}) {
  return (
    <div
      data-section-key={sectionKey}
      className={`bg-white border border-surface-border rounded-2xl p-6 sm:p-8 ${className}`}
    >
      {children}
    </div>
  )
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase
                  text-brand-dark mb-4">
      {children}
    </p>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                  text-ink-subtle mb-2">
      {children}
    </p>
  )
}

// ─── Hero header ──────────────────────────────────────────────────────────────

export function LabHeader({ content }: { content: Record<string, string> }) {
  const initials = (content.lab_name ?? 'L')
    .split(' ')
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section data-section-key="header" className="w-full bg-brand-ghost pt-12 sm:pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <p className="text-[11px] font-display font-semibold tracking-[0.18em]
                      uppercase text-brand-dark mb-6">
          Lab Profile
        </p>
        <div className="flex items-start gap-5 sm:gap-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white
                          border border-surface-border flex items-center justify-center
                          shrink-0">
            <span className="font-display text-2xl sm:text-3xl font-bold text-brand">
              {initials}
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink
                           leading-[1.05] tracking-tight break-words">
              {content.lab_name || 'Lab'}
            </h1>
            {content.pi_name && (
              <p className="mt-3 text-base sm:text-lg font-serif text-ink-light leading-snug">
                <span className="font-semibold">PI:</span> {content.pi_name}
                {content.lab_lead_role && (
                  <span className="text-ink-muted"> · {content.lab_lead_role}</span>
                )}
              </p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1
                            text-base text-ink-muted font-serif">
              {content.institution && <span>{content.institution}</span>}
              {content.department && <span className="text-ink-subtle">·</span>}
              {content.department && <span>{content.department}</span>}
            </div>
            {content.field_and_subfield && (
              <p className="mt-4 text-base font-serif text-ink-muted">
                {content.field_and_subfield}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── About the Lab ────────────────────────────────────────────────────────────

export function LabSummary({ content }: { content: Record<string, string> }) {
  if (!content.one_sentence_lab_summary && !content.lab_mission_statement && !content.why_the_lab_exists)
    return null
  return (
    <Card sectionKey="summary">
      <CardLabel>About the Lab</CardLabel>
      {content.one_sentence_lab_summary && (
        <div className="mb-5">
          <Pullquote>{content.one_sentence_lab_summary}</Pullquote>
        </div>
      )}
      <div className="space-y-3">
        {content.lab_mission_statement && <Prose>{content.lab_mission_statement}</Prose>}
        {content.why_the_lab_exists && (
          <Prose className="text-ink-muted">{content.why_the_lab_exists}</Prose>
        )}
      </div>
    </Card>
  )
}

// ─── Research Areas ───────────────────────────────────────────────────────────

export function TileResearchAreas({
  content,
}: {
  content: { core_research_areas?: string[] }
}) {
  if (!content.core_research_areas?.length) return null
  return (
    <Card sectionKey="research_areas">
      <CardLabel>Research Areas</CardLabel>
      <TagList tags={content.core_research_areas} accent />
    </Card>
  )
}

// ─── Current Directions ───────────────────────────────────────────────────────

export function TileCurrentDirections({
  content,
}: {
  content: { active_directions?: string[] }
}) {
  if (!content.active_directions?.length) return null
  return (
    <Card sectionKey="current_directions">
      <CardLabel>Current Directions</CardLabel>
      <BulletList items={content.active_directions} />
    </Card>
  )
}

// ─── Capabilities ─────────────────────────────────────────────────────────────

export function TileCapabilities({
  content,
}: {
  content: {
    methods_capabilities?: string[]
    datasets_tools_infrastructure?: string[]
  }
}) {
  const hasMethods = content.methods_capabilities?.length
  const hasInfra   = content.datasets_tools_infrastructure?.length
  if (!hasMethods && !hasInfra) return null
  return (
    <Card sectionKey="capabilities">
      <CardLabel>Capabilities</CardLabel>
      <div className="space-y-6">
        {hasMethods && (
          <div>
            <SubLabel>Methods</SubLabel>
            <BulletList items={content.methods_capabilities!} />
          </div>
        )}
        {hasInfra && (
          <div>
            <SubLabel>Infrastructure</SubLabel>
            <BulletList items={content.datasets_tools_infrastructure!} />
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── Flagship Projects ────────────────────────────────────────────────────────

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
    <Card sectionKey="flagship_projects">
      <CardLabel>Flagship Projects</CardLabel>
      <ul className="space-y-0">
        {content.projects.map((p, i) => (
          <li
            key={i}
            className="py-4 border-b border-surface-border last:border-0 last:pb-0 first:pt-0"
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-display font-semibold text-ink text-base leading-snug">
                {p.project_title}
              </h3>
              {p.current_status && (
                <span className="shrink-0 px-2.5 py-1 text-xs border border-brand-dark
                                 text-brand-dark rounded-lg font-medium whitespace-nowrap">
                  {p.current_status}
                </span>
              )}
            </div>
            <p className="text-sm font-serif text-ink-muted leading-relaxed">
              {p.short_description}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ─── Team & Culture ───────────────────────────────────────────────────────────

export function TeamFit({ content }: { content: Record<string, string> }) {
  if (!content.who_belongs_here && !content.lab_culture && !content.mentorship_environment)
    return null
  return (
    <Card sectionKey="team_fit">
      <CardLabel>Team & Culture</CardLabel>
      <div className="space-y-6">
        {content.who_belongs_here && (
          <div>
            <SubLabel>Who belongs here</SubLabel>
            <Prose className="text-[0.95rem]">{content.who_belongs_here}</Prose>
          </div>
        )}
        {content.lab_culture && (
          <div>
            <SubLabel>Lab culture</SubLabel>
            <Prose className="text-[0.95rem]">{content.lab_culture}</Prose>
          </div>
        )}
        {content.mentorship_environment && (
          <div>
            <SubLabel>Mentorship</SubLabel>
            <Prose className="text-[0.95rem]">{content.mentorship_environment}</Prose>
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── Open Opportunities ───────────────────────────────────────────────────────

export function Opportunities({
  content,
}: {
  content: { recruiting_status?: string; open_opportunities?: string[] }
}) {
  if (!content.recruiting_status && !content.open_opportunities?.length) return null
  return (
    <Card sectionKey="opportunities">
      <CardLabel>Open Opportunities</CardLabel>
      {content.recruiting_status && (
        <div className="inline-flex items-center gap-2 px-4 py-2 border
                        border-brand-dark rounded-lg mb-5">
          <span className="w-2 h-2 rounded-full bg-brand-dark animate-pulse" />
          <span className="text-sm font-serif text-brand-dark font-medium">
            {content.recruiting_status}
          </span>
        </div>
      )}
      {content.open_opportunities?.length && (
        <ul className="space-y-0">
          {content.open_opportunities.map((opp, i) => (
            <li
              key={i}
              className="py-3 border-b border-surface-border last:border-0 last:pb-0
                         first:pt-0 font-serif text-[1.05rem] leading-[1.65] text-ink-light"
            >
              {opp}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// ─── Collaboration Asks ───────────────────────────────────────────────────────

export function TileLabAsks({ content }: { content: Record<string, string> }) {
  if (!content.specific_needs_asks) return null
  return (
    <Card sectionKey="asks">
      <CardLabel>Collaboration Asks</CardLabel>
      <Prose className="text-[0.95rem]">{content.specific_needs_asks}</Prose>
      {content.best_fit_people_or_partners && (
        <p className="text-sm font-serif text-ink-muted mt-4 pt-4 border-t border-surface-border">
          <span className="font-semibold text-ink-light">Best fit: </span>
          {content.best_fit_people_or_partners}
        </p>
      )}
    </Card>
  )
}

// ─── What the Lab Offers ──────────────────────────────────────────────────────

export function TileLabOffers({ content }: { content: Record<string, string> }) {
  if (!content.offer_description) return null
  return (
    <Card sectionKey="what_the_lab_offers">
      <CardLabel>What the Lab Offers</CardLabel>
      <Prose className="text-[0.95rem]">{content.offer_description}</Prose>
    </Card>
  )
}

// ─── Publications & Links ─────────────────────────────────────────────────────

export function TileProofVisibility({
  content,
}: {
  content: {
    selected_publications_or_outputs?: Array<{ type: string; title: string; url?: string }>
    research_tags?: string[]
    website_links?: string[]
  }
}) {
  const hasOutputs = content.selected_publications_or_outputs?.length
  const hasLinks   = content.website_links?.length
  const hasTags    = content.research_tags?.length
  if (!hasOutputs && !hasLinks && !hasTags) return null
  return (
    <Card sectionKey="proof_visibility">
      <CardLabel>Publications & Links</CardLabel>
      {hasOutputs && (
        <ul className="space-y-0 mb-5">
          {content.selected_publications_or_outputs!.map((o, i) => (
            <li key={i} className="py-3 border-b border-surface-border last:border-0 last:pb-0 first:pt-0">
              <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                            text-brand-dark mb-0.5">
                {o.type}
              </p>
              {o.url ? (
                <a
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display font-semibold text-ink text-base
                             underline underline-offset-2 decoration-surface-border
                             hover:decoration-ink transition-colors"
                >
                  {o.title} ↗
                </a>
              ) : (
                <p className="font-display font-semibold text-ink text-base leading-snug">
                  {o.title}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      {hasTags && (
        <div className="mb-5">
          <TagList tags={content.research_tags!} accent />
        </div>
      )}
      {hasLinks && (
        <div className="space-y-1.5">
          <SubLabel>Links</SubLabel>
          {content.website_links!.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-serif text-brand hover:text-brand-dark
                         underline underline-offset-2 decoration-brand/30
                         hover:decoration-brand transition-colors truncate"
            >
              {url} ↗
            </a>
          ))}
        </div>
      )}
    </Card>
  )
}

// ─── From the PI ──────────────────────────────────────────────────────────────

export function LabHumanLayer({ content }: { content: Record<string, string> }) {
  if (!content.pi_or_lab_perspective_quote) return null
  return (
    <Card sectionKey="human_layer">
      <CardLabel>From the PI</CardLabel>
      <Quote
        quote={content.pi_or_lab_perspective_quote}
        context={content.why_this_lab_cares_about_this_problem}
      />
    </Card>
  )
}
