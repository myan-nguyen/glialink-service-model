import {
  FullBleed,
  WideSection,
  Tile,
  SectionLabel,
  SectionTitle,
  Prose,
  Pullquote,
  TagList,
  BulletList,
  Quote,
  AskCard,
} from './shared'

// ─── Full-bleed header ──────────────────────────────────────────────────────

export function LabHeader({ content }: { content: Record<string, string> }) {
  const initials = (content.lab_name ?? 'L')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <FullBleed sectionKey="header" className="pt-10 sm:pt-14 pb-8 bg-brand-ghost">
      <p className="text-[11px] font-display font-semibold tracking-[0.18em]
                    uppercase text-brand mb-5">
        Lab Profile
      </p>
      <div className="flex items-start gap-5 sm:gap-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white
                        border-2 border-brand-pale flex items-center justify-center
                        shrink-0">
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand">
            {initials}
          </span>
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink
                         leading-[1.05] tracking-tight">
            {content.lab_name || 'Lab'}
          </h1>
          {content.pi_name && (
            <p className="mt-3 text-base sm:text-lg text-ink-light font-serif">
              <span className="font-semibold">PI:</span> {content.pi_name}
              {content.lab_lead_role && (
                <span className="text-ink-muted"> · {content.lab_lead_role}</span>
              )}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1
                          text-sm text-ink-muted font-serif">
            {content.institution && <span>{content.institution}</span>}
            {content.department && <span className="text-ink-subtle">·</span>}
            {content.department && <span>{content.department}</span>}
          </div>
          {content.field_and_subfield && (
            <p className="mt-4 inline-block px-3 py-1 text-xs font-medium
                          bg-white text-brand-dark rounded-full border border-brand-pale">
              {content.field_and_subfield}
            </p>
          )}
        </div>
      </div>
    </FullBleed>
  )
}

// ─── Wide sections ──────────────────────────────────────────────────────────

export function LabSummary({ content }: { content: Record<string, string> }) {
  if (
    !content.one_sentence_lab_summary &&
    !content.lab_mission_statement &&
    !content.why_the_lab_exists
  )
    return null
  return (
    <WideSection sectionKey="summary">
      <SectionLabel>About the Lab</SectionLabel>
      {content.one_sentence_lab_summary && (
        <div className="mb-5 max-w-3xl">
          <Pullquote>{content.one_sentence_lab_summary}</Pullquote>
        </div>
      )}
      <div className="space-y-3 max-w-3xl">
        {content.lab_mission_statement && (
          <Prose>{content.lab_mission_statement}</Prose>
        )}
        {content.why_the_lab_exists && (
          <Prose className="text-ink-muted">{content.why_the_lab_exists}</Prose>
        )}
      </div>
    </WideSection>
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
    <WideSection sectionKey="flagship_projects">
      <SectionLabel>Flagship Projects</SectionLabel>
      <SectionTitle>Ongoing research</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {content.projects.map((p, i) => (
          <div
            key={i}
            className="border border-surface-border rounded-xl p-5
                       hover:border-brand-light transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-display font-semibold text-ink text-base
                             leading-snug">
                {p.project_title}
              </h3>
              {p.current_status && (
                <span className="shrink-0 px-2 py-0.5 text-[11px] bg-brand-pale
                                 text-brand-dark rounded-full font-medium whitespace-nowrap">
                  {p.current_status}
                </span>
              )}
            </div>
            <p className="text-sm text-ink-light leading-relaxed">
              {p.short_description}
            </p>
          </div>
        ))}
      </div>
    </WideSection>
  )
}

export function TeamFit({ content }: { content: Record<string, string> }) {
  if (
    !content.who_belongs_here &&
    !content.lab_culture &&
    !content.mentorship_environment
  )
    return null
  return (
    <WideSection sectionKey="team_fit">
      <SectionLabel>Team & Culture</SectionLabel>
      <SectionTitle>Who belongs in this lab</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.who_belongs_here && (
          <div>
            <p className="text-xs font-display font-semibold uppercase
                          tracking-wider text-ink-muted mb-2">
              Who belongs here
            </p>
            <Prose className="text-sm">{content.who_belongs_here}</Prose>
          </div>
        )}
        {content.lab_culture && (
          <div>
            <p className="text-xs font-display font-semibold uppercase
                          tracking-wider text-ink-muted mb-2">
              Lab culture
            </p>
            <Prose className="text-sm">{content.lab_culture}</Prose>
          </div>
        )}
        {content.mentorship_environment && (
          <div>
            <p className="text-xs font-display font-semibold uppercase
                          tracking-wider text-ink-muted mb-2">
              Mentorship
            </p>
            <Prose className="text-sm">{content.mentorship_environment}</Prose>
          </div>
        )}
      </div>
    </WideSection>
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
    <WideSection sectionKey="opportunities" className="bg-brand-ghost">
      <SectionLabel>Open Opportunities</SectionLabel>
      <SectionTitle>Join the lab</SectionTitle>
      {content.recruiting_status && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white
                        rounded-full mb-5 border border-brand-pale">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-serif text-brand-dark font-medium">
            {content.recruiting_status}
          </span>
        </div>
      )}
      {content.open_opportunities?.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {content.open_opportunities.map((opp, i) => (
            <AskCard key={i} number={i + 1} title={opp} />
          ))}
        </div>
      )}
    </WideSection>
  )
}

export function LabHumanLayer({ content }: { content: Record<string, string> }) {
  if (!content.pi_or_lab_perspective_quote) return null
  return (
    <WideSection sectionKey="human_layer">
      <SectionLabel>From the PI</SectionLabel>
      <Quote
        quote={content.pi_or_lab_perspective_quote}
        context={content.why_this_lab_cares_about_this_problem}
      />
    </WideSection>
  )
}

// ─── Tile content pieces ────────────────────────────────────────────────────

export function TileResearchAreas({
  content,
}: {
  content: { core_research_areas?: string[] }
}) {
  if (!content.core_research_areas?.length) return null
  return (
    <Tile sectionKey="research_areas">
      <SectionLabel>Research Areas</SectionLabel>
      <TagList tags={content.core_research_areas} accent />
    </Tile>
  )
}

export function TileCurrentDirections({
  content,
}: {
  content: { active_directions?: string[] }
}) {
  if (!content.active_directions?.length) return null
  return (
    <Tile sectionKey="current_directions">
      <SectionLabel>Current Directions</SectionLabel>
      <div className="mt-2">
        <BulletList items={content.active_directions} />
      </div>
    </Tile>
  )
}

export function TileCapabilities({
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
    <Tile sectionKey="capabilities">
      <SectionLabel>Capabilities</SectionLabel>
      <div className="space-y-4 mt-2">
        {hasMethods && (
          <div>
            <p className="text-xs font-semibold text-ink-light mb-1.5">Methods</p>
            <BulletList items={content.methods_capabilities!} />
          </div>
        )}
        {hasInfra && (
          <div>
            <p className="text-xs font-semibold text-ink-light mb-1.5">
              Infrastructure
            </p>
            <BulletList items={content.datasets_tools_infrastructure!} />
          </div>
        )}
      </div>
    </Tile>
  )
}

export function TileLabAsks({ content }: { content: Record<string, string> }) {
  if (!content.specific_needs_asks) return null
  return (
    <Tile sectionKey="asks">
      <SectionLabel>Collaboration Asks</SectionLabel>
      <Prose className="text-[0.95rem]">{content.specific_needs_asks}</Prose>
      {content.best_fit_people_or_partners && (
        <p className="text-xs text-ink-muted font-serif mt-3 pt-3
                      border-t border-surface-border">
          <span className="font-semibold text-ink-light">Best fit: </span>
          {content.best_fit_people_or_partners}
        </p>
      )}
    </Tile>
  )
}

export function TileLabOffers({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.offer_description) return null
  return (
    <Tile sectionKey="what_the_lab_offers">
      <SectionLabel>What the Lab Offers</SectionLabel>
      <Prose className="text-[0.95rem]">{content.offer_description}</Prose>
    </Tile>
  )
}

export function TileProofVisibility({
  content,
}: {
  content: {
    selected_publications_or_outputs?: Array<{
      type: string
      title: string
      url?: string
    }>
    research_tags?: string[]
    website_links?: string[]
  }
}) {
  const hasOutputs = content.selected_publications_or_outputs?.length
  const hasLinks = content.website_links?.length
  const hasTags = content.research_tags?.length
  if (!hasOutputs && !hasLinks && !hasTags) return null
  return (
    <Tile sectionKey="proof_visibility">
      <SectionLabel>Publications & Links</SectionLabel>
      {hasOutputs && (
        <div className="space-y-2 mb-3">
          {content.selected_publications_or_outputs!.slice(0, 3).map((o, i) => (
            <div key={i}>
              <p className="text-[10px] text-brand uppercase tracking-wider
                            font-display font-semibold">
                {o.type}
              </p>
              {o.url ? (
                <a
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-light hover:text-brand leading-snug"
                >
                  {o.title} ↗
                </a>
              ) : (
                <p className="text-sm text-ink-light leading-snug">{o.title}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {hasLinks && (
        <div className="space-y-1">
          {content.website_links!.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-brand hover:text-brand-dark truncate"
            >
              {url} ↗
            </a>
          ))}
        </div>
      )}
    </Tile>
  )
}