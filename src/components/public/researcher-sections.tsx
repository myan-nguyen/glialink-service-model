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
} from './shared'

// ─── Full-bleed header ──────────────────────────────────────────────────────

export function ResearcherHeader({
  content,
}: {
  content: Record<string, string>
}) {
  const initials = (content.researcher_name ?? 'R')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <FullBleed sectionKey="header" className="pt-10 sm:pt-14 pb-8 bg-brand-ghost">
      <div className="flex items-start gap-5 sm:gap-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white
                        border-2 border-brand-pale flex items-center justify-center
                        shrink-0">
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand">
            {initials}
          </span>
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink
                         leading-[1.05] tracking-tight">
            {content.researcher_name || 'Researcher'}
          </h1>
          {content.role_career_stage && (
            <p className="mt-3 text-base sm:text-lg font-semibold text-ink-light">
              {content.role_career_stage}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1
                          text-sm text-ink-muted font-serif">
            {content.institution && <span>{content.institution}</span>}
            {content.department_or_lab && (
              <span className="text-ink-subtle">·</span>
            )}
            {content.department_or_lab && <span>{content.department_or_lab}</span>}
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
        <div className="mb-5 max-w-3xl">
          <Pullquote>{content.mission_statement}</Pullquote>
        </div>
      )}
      <div className="space-y-3 max-w-3xl">
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
  const hasDomain = content.domain_expertise?.length
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

export function HumanLayer({ content }: { content: Record<string, string> }) {
  if (
    !content.researcher_perspective_quote &&
    !content.working_style_or_values
  )
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
        <p className="mt-5 text-[0.975rem] text-ink-muted leading-relaxed italic
                      max-w-2xl">
          {content.working_style_or_values}
        </p>
      )}
    </WideSection>
  )
}

// ─── Tile content pieces ────────────────────────────────────────────────────

export function TileResearchThemes({
  content,
}: {
  content: { core_research_themes?: string[] }
}) {
  if (!content.core_research_themes?.length) return null
  return (
    <Tile sectionKey="research_themes">
      <SectionLabel>Research Themes</SectionLabel>
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
  const hasLinks =
    content.website_links?.length ||
    content.publication_links?.length ||
    content.lab_link
  if (!content.keywords_tags?.length && !hasLinks) return null
  return (
    <Tile sectionKey="discoverability">
      <SectionLabel>Links & Keywords</SectionLabel>
      {content.keywords_tags?.length && (
        <div className="mb-4">
          <TagList tags={content.keywords_tags} />
        </div>
      )}
      {hasLinks && (
        <div className="space-y-1.5">
          {[
            ...(content.website_links ?? []),
            ...(content.publication_links ?? []),
            ...(content.lab_link ? [content.lab_link] : []),
          ].map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-brand hover:text-brand-dark
                         transition-colors truncate"
            >
              {url} ↗
            </a>
          ))}
        </div>
      )}
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
            <p className="text-[10px] text-brand uppercase tracking-wider
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
      <SectionLabel>What I'm Looking For</SectionLabel>
      <div className="space-y-3 mt-2">
        {content.primary_needs && (
          <div>
            <p className="text-xs font-semibold text-ink-light mb-1">Primary</p>
            <p className="text-sm text-ink-light leading-relaxed">
              {content.primary_needs}
            </p>
          </div>
        )}
        {content.secondary_needs && (
          <div>
            <p className="text-xs font-semibold text-ink-light mb-1">Secondary</p>
            <p className="text-sm text-ink-muted leading-relaxed">
              {content.secondary_needs}
            </p>
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