'use client'
import { useState } from 'react'
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

// ─── Full-bleed header ──────────────────────────────────────────────────────

export function ProjectHeader({ content }: { content: Record<string, string> }) {
  return (
    <section className="w-full pt-10 sm:pt-14 pb-6 bg-brand-ghost">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {content.project_type_label && (
              <p className="text-[11px] font-display font-semibold tracking-[0.18em]
                            uppercase text-brand mb-5">
                {content.project_type_label}
              </p>
            )}
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink
                           leading-[1.1] mb-5 tracking-tight break-words">
              {content.project_title || 'Untitled Project'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base
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
              <p className="text-base text-ink-muted font-serif mt-1">
                {content.department_or_lab}
              </p>
            )}
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

export function CurrentStagePill({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.current_stage) return null
  return (
    <WideSection sectionKey="current_stage" className="pt-5 pb-3">
      <div className="inline-flex items-center gap-2 px-4 py-2 border
                      border-brand-dark rounded-lg">
        <span className="w-2 h-2 rounded-full bg-brand-dark animate-pulse" />
        <span className="text-sm font-serif text-brand-dark font-medium">
          {content.current_stage}
        </span>
      </div>
    </WideSection>
  )
}

export function ProjectSummary({ content }: { content: Record<string, string> }) {
  if (!content.one_sentence_summary) return null
  return (
    <WideSection sectionKey="summary" className="pt-3 pb-2">
      <Pullquote>{content.one_sentence_summary}</Pullquote>
    </WideSection>
  )
}

export function WhyThisMatters({ content }: { content: Record<string, string> }) {
  if (!content.relevance && !content.urgency && !content.context) return null
  return (
    <WideSection sectionKey="why_this_matters" className="pt-5 pb-8">
      <SectionLabel>Background</SectionLabel>
      <SectionTitle>Why this matters</SectionTitle>
      <div className="space-y-3">
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
                       leading-snug mb-5">
          {content.research_question}
        </h2>
      )}
      {content.project_description && (
        <Prose>{content.project_description}</Prose>
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
            <h3 className="font-display font-semibold text-ink text-base leading-snug break-words">
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

// ─── Ask card with native share ─────────────────────────────────────────────

function ProjectAskCard({
  number,
  title,
  description,
  bestFit,
}: {
  number: number
  title?: string
  description?: string
  bestFit?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: title ?? 'Research ask', url })
        return
      } catch {
        // user cancelled or API unavailable — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!title && !description) return null
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 sm:p-6
                    hover:border-brand-light transition-colors">
      <div className="flex items-start gap-4">
        <span className="font-display text-xs text-ink-subtle font-semibold
                         tracking-wider pt-1 shrink-0">
          {String(number).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0 space-y-2.5">
          {title && (
            <h3 className="font-display font-semibold text-ink text-lg leading-snug break-words">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[0.975rem] text-ink-light leading-relaxed">
              {description}
            </p>
          )}
          {bestFit && (
            <p className="text-sm text-ink-muted font-serif pt-1">
              <span className="font-semibold text-ink-light">Best fit: </span>
              {bestFit}
            </p>
          )}
          <button
            onClick={handleShare}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted
                       hover:text-brand transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 shrink-0"
            >
              <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .793l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.475l6.733-3.367A2.52 2.52 0 0 1 13 4.5Z" />
            </svg>
            {copied ? 'Link copied!' : 'Share this ask'}
          </button>
        </div>
      </div>
    </div>
  )
}

type AskItem = { ask_title?: string; ask_description?: string; best_fit_people?: string }

export function ProjectAsks({ content }: { content: Record<string, unknown> }) {
  // Support new (items array) and old (flat string fields) formats
  const items: AskItem[] = Array.isArray((content as { items?: unknown }).items) && (content as { items: AskItem[] }).items.length > 0
    ? (content as { items: AskItem[] }).items
    : (content.ask_title || content.ask_description)
      ? [{ ask_title: content.ask_title as string, ask_description: content.ask_description as string, best_fit_people: content.best_fit_people as string }]
      : []

  if (items.length === 0) return null

  return (
    <WideSection sectionKey="asks" className="bg-brand-ghost">
      <SectionLabel>Specific Asks · Collaboration Opportunities</SectionLabel>
      <SectionTitle>How others can help extend this research</SectionTitle>
      <div className="space-y-4">
        {items.map((item, i) => (
          <ProjectAskCard
            key={i}
            number={i + 1}
            title={item.ask_title}
            description={item.ask_description}
            bestFit={item.best_fit_people}
          />
        ))}
      </div>
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
            className="px-3 py-1.5 text-xs border border-brand-dark text-brand-dark
                       rounded-lg font-medium break-words max-w-full"
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
