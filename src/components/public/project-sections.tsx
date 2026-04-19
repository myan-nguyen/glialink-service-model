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

export function ProjectHeader({ content }: { content: Record<string, string> }) {
  return (
    <FullBleed sectionKey="header" className="pt-10 sm:pt-14 pb-6 bg-brand-ghost">
      {content.project_type_label && (
        <p className="text-[11px] font-display font-semibold tracking-[0.18em]
                      uppercase text-brand mb-5">
          {content.project_type_label}
        </p>
      )}
      <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink
                     leading-[1.1] mb-5 tracking-tight max-w-4xl">
        {content.project_title || 'Untitled Project'}
      </h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm
                      text-ink-muted font-serif">
        {content.researcher_name && (
          <span className="font-semibold text-ink-light">
            {content.researcher_name}
          </span>
        )}
        {content.researcher_role && <span className="text-ink-subtle">·</span>}
        {content.researcher_role && <span>{content.researcher_role}</span>}
        {content.institution && <span className="text-ink-subtle">·</span>}
        {content.institution && <span>{content.institution}</span>}
      </div>
      {content.department_or_lab && (
        <p className="text-sm text-ink-muted font-serif mt-1">
          {content.department_or_lab}
        </p>
      )}
    </FullBleed>
  )
}

// ─── Wide sections ──────────────────────────────────────────────────────────

export function CurrentStagePill({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.current_stage) return null
  return (
    <WideSection sectionKey="current_stage" className="py-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-pale
                      rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
        <span className="text-xs font-serif text-brand-dark font-medium">
          {content.current_stage}
        </span>
      </div>
    </WideSection>
  )
}

export function ProjectSummary({ content }: { content: Record<string, string> }) {
  if (!content.one_sentence_summary) return null
  return (
    <WideSection sectionKey="summary">
      <Pullquote>{content.one_sentence_summary}</Pullquote>
    </WideSection>
  )
}

export function WhyThisMatters({ content }: { content: Record<string, string> }) {
  if (!content.relevance && !content.urgency && !content.context) return null
  return (
    <WideSection sectionKey="why_this_matters">
      <SectionLabel>Background</SectionLabel>
      <SectionTitle>Why this matters</SectionTitle>
      <div className="space-y-3 max-w-3xl">
        {content.relevance && <Prose>{content.relevance}</Prose>}
        {content.urgency && <Prose>{content.urgency}</Prose>}
        {content.context && <Prose>{content.context}</Prose>}
      </div>
    </WideSection>
  )
}

export function ResearchFocus({ content }: { content: Record<string, string> }) {
  if (!content.research_question && !content.project_description) return null
  return (
    <WideSection sectionKey="research_focus">
      <SectionLabel>Research Question</SectionLabel>
      {content.research_question && (
        <h2 className="font-display text-xl sm:text-2xl italic text-ink
                       leading-snug mb-5 max-w-3xl">
          {content.research_question}
        </h2>
      )}
      {content.project_description && (
        <Prose className="max-w-3xl">{content.project_description}</Prose>
      )}
    </WideSection>
  )
}

export function FiguresEvidence({
  content,
}: {
  content: {
    selected_figures?: Array<{
      figure_label: string
      figure_title: string
      figure_caption: string
      figure_takeaway: string
    }>
  }
}) {
  if (!content.selected_figures?.length) return null
  return (
    <WideSection sectionKey="figures_evidence">
      <SectionLabel>Figures · Evidence</SectionLabel>
      <SectionTitle>Selected visual evidence</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {content.selected_figures.map((fig, i) => (
          <div
            key={i}
            className="border border-surface-border rounded-xl p-5 space-y-2"
          >
            <p className="text-xs font-display font-semibold tracking-wider
                          uppercase text-brand">
              {fig.figure_label}
            </p>
            <h3 className="font-display font-semibold text-ink text-base leading-snug">
              {fig.figure_title}
            </h3>
            {fig.figure_caption && (
              <p className="text-sm text-ink-muted leading-relaxed">
                {fig.figure_caption}
              </p>
            )}
            {fig.figure_takeaway && (
              <p className="text-sm text-ink-light leading-relaxed pt-2
                            border-t border-surface-border">
                {fig.figure_takeaway}
              </p>
            )}
          </div>
        ))}
      </div>
    </WideSection>
  )
}

export function ProjectAsks({ content }: { content: Record<string, string> }) {
  if (!content.ask_title && !content.ask_description) return null
  return (
    <WideSection sectionKey="asks" className="bg-brand-ghost">
      <SectionLabel>Specific Asks · Collaboration Opportunities</SectionLabel>
      <SectionTitle>How others can help extend this research</SectionTitle>
      <AskCard
        number={1}
        title={content.ask_title}
        description={content.ask_description}
        bestFit={content.best_fit_people}
      />
    </WideSection>
  )
}

export function ResearcherPerspective({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.quote) return null
  return (
    <WideSection sectionKey="researcher_perspective">
      <SectionLabel>Researcher Perspective</SectionLabel>
      <Quote quote={content.quote} context={content.context} />
    </WideSection>
  )
}

// ─── Tile content pieces ────────────────────────────────────────────────────

export function TileResearchTags({ content }: { content: { tags?: string[] } }) {
  if (!content.tags?.length) return null
  return (
    <Tile sectionKey="research_tags">
      <SectionLabel>Research Tags</SectionLabel>
      <TagList tags={content.tags} accent />
    </Tile>
  )
}

export function TileKeyFindings({
  content,
}: {
  content: { findings?: string[] }
}) {
  if (!content.findings?.length) return null
  return (
    <Tile sectionKey="key_findings">
      <SectionLabel>Key Findings</SectionLabel>
      <div className="mt-2">
        <BulletList items={content.findings} />
      </div>
    </Tile>
  )
}

export function TileMethods({ content }: { content: Record<string, string> }) {
  if (!content.methods_approach) return null
  return (
    <Tile sectionKey="methods_approach">
      <SectionLabel>Methods</SectionLabel>
      <Prose className="text-[0.95rem]">{content.methods_approach}</Prose>
    </Tile>
  )
}

export function TilePotentialImpact({
  content,
}: {
  content: { outcomes?: string[] }
}) {
  if (!content.outcomes?.length) return null
  return (
    <Tile sectionKey="potential_impact">
      <SectionLabel>Potential Impact</SectionLabel>
      <div className="flex flex-wrap gap-2 mt-1">
        {content.outcomes.map((outcome, i) => (
          <span
            key={i}
            className="px-3 py-1.5 text-xs bg-brand-pale text-brand-dark
                       rounded-full font-medium"
          >
            {outcome}
          </span>
        ))}
      </div>
    </Tile>
  )
}

export function TileWhatWeOffer({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.offer_description) return null
  return (
    <Tile sectionKey="what_we_offer">
      <SectionLabel>What We Offer</SectionLabel>
      <Prose className="text-[0.95rem]">{content.offer_description}</Prose>
    </Tile>
  )
}