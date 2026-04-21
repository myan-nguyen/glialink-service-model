import {
  WideSection,
  Tile,
  SectionLabel,
  SectionTitle,
  Prose,
  Pullquote,
  TagList,
  BulletList,
  Quote,
} from './shared'

// ─── Hero header ──────────────────────────────────────────────────────────────

export function ResearcherHeader({
  content,
  links = [],
}: {
  content: Record<string, string>
  links?: string[]
}) {
  const initials = (content.researcher_name ?? 'R')
    .split(' ')
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section data-section-key="header" className="w-full bg-brand-ghost pt-12 sm:pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5 sm:gap-8 min-w-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white
                            border border-surface-border flex items-center justify-center
                            shrink-0">
              <span className="font-display text-2xl sm:text-3xl font-bold text-brand">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink
                             leading-[1.05] tracking-tight break-words">
                {content.researcher_name || 'Researcher'}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1
                              text-base sm:text-lg font-serif text-ink-light">
                {content.role_career_stage && (
                  <span className="font-semibold">{content.role_career_stage}</span>
                )}
                {content.institution && (
                  <>
                    {content.role_career_stage && <span className="text-ink-subtle">·</span>}
                    <span>{content.institution}</span>
                  </>
                )}
                {content.department_or_lab && (
                  <>
                    <span className="text-ink-subtle">·</span>
                    <span className="text-ink-muted">{content.department_or_lab}</span>
                  </>
                )}
              </div>
              {content.field_and_subfield && (
                <p className="mt-1.5 text-base font-serif text-ink-muted">
                  {content.field_and_subfield}
                </p>
              )}
              {links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {links.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-serif text-brand hover:text-brand-dark
                                 underline underline-offset-2 decoration-brand/30
                                 hover:decoration-brand transition-colors break-all"
                    >
                      {url} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <a
            href="https://www.joinglialink.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start shrink-0 sm:mt-1 px-4 py-2 text-sm font-serif font-medium
                       bg-brand text-white rounded-lg hover:bg-brand-dark
                       transition-colors whitespace-nowrap"
          >
            Join Glialink ↗
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Wide sections ──────────────────────────────────────────────────────────

export function ResearcherIdentity({
  content,
}: {
  content: Record<string, string>
}) {
  if (
    !content.identity_statement &&
    !content.mission_statement &&
    !content.plain_language_research_description
  )
    return null
  return (
    <WideSection sectionKey="identity">
      <SectionLabel>About</SectionLabel>
      {content.mission_statement && (
        <div className="mb-5">
          <Pullquote>{content.mission_statement}</Pullquote>
        </div>
      )}
      <div className="space-y-3">
        {content.identity_statement && <Prose>{content.identity_statement}</Prose>}
        {content.plain_language_research_description && (
          <Prose>{content.plain_language_research_description}</Prose>
        )}
      </div>
    </WideSection>
  )
}

export function ExpertiseSection({
  content,
}: {
  content: { methods_expertise?: string[]; domain_expertise?: string[] }
}) {
  const hasMethods = content.methods_expertise?.length
  const hasDomain  = content.domain_expertise?.length
  if (!hasMethods && !hasDomain) return null
  return (
    <WideSection sectionKey="expertise">
      <SectionLabel>Expertise</SectionLabel>
      <SectionTitle>Skills & specializations</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl">
        {hasMethods && (
          <div>
            <p className="text-xs font-display font-semibold uppercase
                          tracking-wider text-ink-muted mb-3">
              Methods
            </p>
            <BulletList items={content.methods_expertise!} />
          </div>
        )}
        {hasDomain && (
          <div>
            <p className="text-xs font-display font-semibold uppercase
                          tracking-wider text-ink-muted mb-3">
              Domain
            </p>
            <BulletList items={content.domain_expertise!} />
          </div>
        )}
      </div>
    </WideSection>
  )
}

// ─── Selected projects with status indicator ─────────────────────────────────

function projectStatusColor(status: string): string {
  const s = status.toLowerCase()
  if (
    s.includes('terminat') ||
    s.includes('complet') ||
    s.includes('publish') ||
    s.includes('ended') ||
    s.includes('closed')
  ) {
    return 'bg-red-400'
  }
  return 'bg-green-400'
}

export function SelectedProjects({
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
    <WideSection sectionKey="selected_projects">
      <SectionLabel>Selected Projects</SectionLabel>
      <SectionTitle>Recent & ongoing work</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {content.projects.map((p, i) => (
          <div
            key={i}
            className="border border-surface-border rounded-xl p-5
                       hover:border-brand-light transition-colors"
          >
            {p.current_status && (
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${projectStatusColor(p.current_status)}`}
                />
                <span className="text-xs font-serif text-ink-muted truncate">
                  {p.current_status}
                </span>
              </div>
            )}
            <h3 className="font-display font-semibold text-ink text-base leading-snug mb-2">
              {p.project_title}
            </h3>
            <p className="text-sm text-ink-light leading-relaxed">
              {p.short_description}
            </p>
          </div>
        ))}
      </div>
    </WideSection>
  )
}

export function HumanLayer({ content }: { content: Record<string, string> }) {
  if (!content.researcher_perspective_quote && !content.working_style_or_values)
    return null
  return (
    <WideSection sectionKey="human_layer">
      <SectionLabel>Perspective</SectionLabel>
      {content.researcher_perspective_quote && (
        <Quote
          quote={content.researcher_perspective_quote}
          context={content.why_this_work_matters_to_them}
        />
      )}
      {content.working_style_or_values && (
        <p className="mt-5 text-[0.975rem] text-ink-muted leading-relaxed italic max-w-2xl">
          {content.working_style_or_values}
        </p>
      )}
    </WideSection>
  )
}

// ─── Tile content pieces ──────────────────────────────────────────────────────

export function TileResearchThemes({
  content,
}: {
  content: { core_research_themes?: string[] }
}) {
  if (!content.core_research_themes?.length) return null
  return (
    <Tile sectionKey="research_themes">
      <SectionLabel>Research Areas</SectionLabel>
      <TagList tags={content.core_research_themes} accent />
    </Tile>
  )
}

export function TileCurrentFocus({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.current_focus_description) return null
  return (
    <Tile sectionKey="current_focus">
      <SectionLabel>Current Focus</SectionLabel>
      <Prose className="text-[0.95rem]">{content.current_focus_description}</Prose>
    </Tile>
  )
}

// Keywords only — links have moved to the header
export function TileDiscoverability({
  content,
}: {
  content: {
    keywords_tags?: string[]
    website_links?: string[]
    publication_links?: string[]
    lab_link?: string
  }
}) {
  if (!content.keywords_tags?.length) return null
  return (
    <Tile sectionKey="discoverability">
      <SectionLabel>Keywords</SectionLabel>
      <TagList tags={content.keywords_tags} />
    </Tile>
  )
}

export function TileSelectedOutputs({
  content,
}: {
  content: {
    outputs?: Array<{ type: string; title: string; url?: string }>
  }
}) {
  if (!content.outputs?.length) return null
  return (
    <Tile sectionKey="selected_outputs">
      <SectionLabel>Selected Work</SectionLabel>
      <div className="space-y-2.5 mt-2">
        {content.outputs.map((o, i) => (
          <div key={i}>
            <p className="text-[10px] text-brand-dark uppercase tracking-wider
                          font-display font-semibold mb-0.5">
              {o.type}
            </p>
            {o.url ? (
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-light hover:text-brand leading-snug
                           transition-colors"
              >
                {o.title}
                <span className="ml-1 text-brand/60">↗</span>
              </a>
            ) : (
              <p className="text-sm text-ink-light leading-snug">{o.title}</p>
            )}
          </div>
        ))}
      </div>
    </Tile>
  )
}

export function TileResearcherAsks({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.primary_needs && !content.secondary_needs) return null
  return (
    <Tile sectionKey="asks">
      <SectionLabel>What I&apos;m Looking For</SectionLabel>
      <div className="space-y-3 mt-2">
        {content.primary_needs && (
          <div>
            <p className="text-xs font-semibold text-ink-light mb-1">Primary</p>
            <p className="text-sm text-ink-light leading-relaxed">{content.primary_needs}</p>
          </div>
        )}
        {content.secondary_needs && (
          <div>
            <p className="text-xs font-semibold text-ink-light mb-1">Secondary</p>
            <p className="text-sm text-ink-muted leading-relaxed">{content.secondary_needs}</p>
          </div>
        )}
      </div>
    </Tile>
  )
}

export function TileWhatTheyOffer({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.offer_description) return null
  return (
    <Tile sectionKey="what_they_offer">
      <SectionLabel>What I Offer</SectionLabel>
      <Prose className="text-[0.95rem]">{content.offer_description}</Prose>
    </Tile>
  )
}
