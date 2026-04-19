import {
  SectionWrapper,
  SectionLabel,
  SectionHeading,
  Prose,
  TagList,
  BulletList,
  Pullquote,
  InlineMeta,
  StatusPill,
} from './primitives'

export function ProjectHeader({ content }: { content: Record<string, string> }) {
  return (
    <div className="py-12 sm:py-16 border-b border-canvas-border
                    animate-fade-up">
      {content.project_type_label && (
        <p className="text-[11px] font-sans font-semibold tracking-[0.18em]
                      uppercase text-brand mb-4 flex items-center gap-2">
          <span className="text-brand-soft">✦</span>
          {content.project_type_label}
        </p>
      )}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold
                     text-ink leading-[1.1] mb-5 tracking-tight">
        {content.project_title || 'Untitled Project'}
      </h1>
      <InlineMeta
        items={[
          content.researcher_name,
          content.researcher_role,
          content.institution,
          content.department_or_lab,
        ]}
      />
    </div>
  )
}

export function ProjectSummary({ content }: { content: Record<string, string> }) {
  if (!content.one_sentence_summary) return null
  return (
    <div className="py-10 sm:py-12 border-b border-canvas-border
                    animate-fade-up" style={{ animationDelay: '50ms' }}>
      <p className="font-display text-xl sm:text-2xl text-ink-light
                    leading-[1.4] max-w-[680px]">
        {content.one_sentence_summary}
      </p>
    </div>
  )
}

export function CurrentStage({ content }: { content: Record<string, string> }) {
  if (!content.current_stage) return null
  return (
    <div className="py-5 border-b border-canvas-border">
      <StatusPill text={content.current_stage} />
    </div>
  )
}

export function WhyThisMatters({ content }: { content: Record<string, string> }) {
  const hasAny = content.relevance || content.urgency || content.context
  if (!hasAny) return null
  return (
    <SectionWrapper>
      <SectionLabel>Background</SectionLabel>
      <SectionHeading>Why this matters</SectionHeading>
      <div className="space-y-4 max-w-[680px]">
        {content.relevance && <Prose>{content.relevance}</Prose>}
        {content.urgency && <Prose>{content.urgency}</Prose>}
        {content.context && <Prose>{content.context}</Prose>}
      </div>
    </SectionWrapper>
  )
}

export function ResearchFocus({ content }: { content: Record<string, string> }) {
  const hasAny = content.research_question || content.project_description
  if (!hasAny) return null
  return (
    <SectionWrapper>
      <SectionLabel>Research question</SectionLabel>
      <SectionHeading>What is being investigated?</SectionHeading>
      <div className="max-w-[680px] space-y-5">
        {content.research_question && (
          <Pullquote quote={content.research_question} />
        )}
        {content.project_description && (
          <Prose>{content.project_description}</Prose>
        )}
      </div>
    </SectionWrapper>
  )
}

export function MethodsApproach({ content }: { content: Record<string, string> }) {
  if (!content.methods_approach) return null
  return (
    <SectionWrapper>
      <SectionLabel>Methods / Approach</SectionLabel>
      <SectionHeading>How the work was done</SectionHeading>
      <Prose className="max-w-[680px]">{content.methods_approach}</Prose>
    </SectionWrapper>
  )
}

export function KeyFindings({ content }: { content: { findings?: string[] } }) {
  if (!content.findings?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Glialink summary</SectionLabel>
      <SectionHeading>Key findings</SectionHeading>
      <div className="max-w-[680px]">
        <BulletList items={content.findings} />
      </div>
    </SectionWrapper>
  )
}

export function ResearchTags({ content }: { content: { tags?: string[] } }) {
  if (!content.tags?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Project tags</SectionLabel>
      <SectionHeading>Research areas</SectionHeading>
      <TagList tags={content.tags} />
    </SectionWrapper>
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
    <SectionWrapper>
      <SectionLabel>Figures from the publication</SectionLabel>
      <SectionHeading>Selected visual evidence</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px]">
        {content.selected_figures.map((fig, i) => (
          <div
            key={i}
            className="bg-canvas-soft border border-canvas-border rounded-xl
                       p-5 space-y-3"
          >
            <p className="text-xs font-sans font-semibold text-brand
                          tracking-wide uppercase">
              {fig.figure_label}
            </p>
            <h3 className="font-display text-base font-semibold text-ink
                           leading-snug">
              {fig.figure_title}
            </h3>
            {fig.figure_caption && (
              <p className="text-sm text-ink-muted leading-relaxed">
                {fig.figure_caption}
              </p>
            )}
            {fig.figure_takeaway && (
              <p className="text-sm text-ink-light leading-relaxed pt-2
                            border-t border-canvas-border">
                {fig.figure_takeaway}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function ProjectAsks({ content }: { content: Record<string, string> }) {
  const hasAny =
    content.ask_title || content.ask_description || content.best_fit_people
  if (!hasAny) return null
  return (
    <SectionWrapper className="bg-brand-mist/40 -mx-4 sm:-mx-6 px-4 sm:px-6
                               rounded-2xl">
      <SectionLabel>Specific asks / Collaboration opportunities</SectionLabel>
      <SectionHeading>How others can directly help extend this research</SectionHeading>
      <div className="max-w-[680px] space-y-6">
        <div className="bg-canvas border border-canvas-border rounded-xl
                        p-5 sm:p-6 space-y-3">
          <p className="text-[11px] font-sans font-semibold tracking-wider
                        uppercase text-ink-subtle">
            Ask
          </p>
          {content.ask_title && (
            <h3 className="font-display text-xl font-semibold text-ink
                           leading-snug">
              {content.ask_title}
            </h3>
          )}
          {content.ask_description && (
            <Prose>{content.ask_description}</Prose>
          )}
          {content.best_fit_people && (
            <p className="text-sm text-ink-muted font-sans pt-2
                          border-t border-canvas-border">
              <span className="font-semibold text-ink-light">Best fit: </span>
              {content.best_fit_people}
            </p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

// Multi-ask variant — preferred rendering when asks section holds an array
export function ProjectAsksList({
  asks,
}: {
  asks: Array<{
    ask_title?: string
    ask_description?: string
    best_fit_people?: string
  }>
}) {
  if (!asks?.length) return null
  return (
    <SectionWrapper className="bg-brand-mist/40 -mx-4 sm:-mx-6 px-4 sm:px-6
                               rounded-2xl">
      <SectionLabel>Specific asks / Collaboration opportunities</SectionLabel>
      <SectionHeading>How others can directly help</SectionHeading>
      <div className="max-w-[760px] space-y-4">
        {asks.map((ask, i) => (
          <div
            key={i}
            className="bg-canvas border border-canvas-border rounded-xl
                       p-5 sm:p-6 space-y-3 relative"
          >
            <p className="text-[11px] font-sans font-semibold tracking-wider
                          uppercase text-ink-subtle">
              Ask {String(i + 1).padStart(2, '0')}
            </p>
            {ask.ask_title && (
              <h3 className="font-display text-lg sm:text-xl font-semibold
                             text-ink leading-snug">
                {ask.ask_title}
              </h3>
            )}
            {ask.ask_description && <Prose>{ask.ask_description}</Prose>}
            {ask.best_fit_people && (
              <p className="text-sm text-ink-muted font-sans pt-2
                            border-t border-canvas-border">
                <span className="font-semibold text-ink-light">Best fit: </span>
                {ask.best_fit_people}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function WhatWeOffer({ content }: { content: Record<string, string> }) {
  if (!content.offer_description) return null
  return (
    <SectionWrapper>
      <SectionLabel>What we offer</SectionLabel>
      <SectionHeading>What collaborators can gain</SectionHeading>
      <Prose className="max-w-[680px]">{content.offer_description}</Prose>
    </SectionWrapper>
  )
}

export function PotentialImpact({
  content,
}: {
  content: { outcomes?: string[] }
}) {
  if (!content.outcomes?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Potential impact</SectionLabel>
      <SectionHeading>What this could improve</SectionHeading>
      <div className="flex flex-wrap gap-2 max-w-[680px]">
        {content.outcomes.map((outcome, i) => (
          <span
            key={i}
            className="px-4 py-2 text-sm font-sans bg-brand-ghost
                       text-brand-deep rounded-full"
          >
            {outcome}
          </span>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function ResearcherPerspective({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.quote) return null
  return (
    <SectionWrapper>
      <SectionLabel>Researcher perspective</SectionLabel>
      <SectionHeading>
        {content.context || 'Why this work matters'}
      </SectionHeading>
      <Pullquote quote={content.quote} attribution={content.attribution} />
    </SectionWrapper>
  )
}