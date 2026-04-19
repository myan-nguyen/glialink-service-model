import React from 'react'

// ─── Layout primitives ──────────────────────────────────────────────────────

export function FullBleed({
  children,
  className = '',
  sectionKey,
}: {
  children: React.ReactNode
  className?: string
  sectionKey?: string
}) {
  return (
    <section
      data-section-key={sectionKey}
      className={`w-full py-8 sm:py-10 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">{children}</div>
    </section>
  )
}

export function WideSection({
  children,
  className = '',
  sectionKey,
}: {
  children: React.ReactNode
  className?: string
  sectionKey?: string
}) {
  return (
    <section
      data-section-key={sectionKey}
      className={`w-full py-8 sm:py-10 ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8">{children}</div>
    </section>
  )
}

export function TileGrid({
  children,
  columns = 3,
  tileHeight = 'h-72',
}: {
  children: React.ReactNode
  columns?: 2 | 3
  tileHeight?: string
}) {
  const colClass = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  const nonNullChildren = React.Children.toArray(children).filter(Boolean)
  if (nonNullChildren.length === 0) return null

  return (
    <section className="w-full py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className={`grid grid-cols-1 ${colClass} gap-4`}>
          {nonNullChildren.map((child, i) => (
            <div
              key={i}
              className={`${tileHeight} border border-surface-border
                          rounded-xl bg-surface overflow-hidden
                          flex flex-col`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Tile({
  children,
  sectionKey,
}: {
  children: React.ReactNode
  sectionKey?: string
}) {
  return (
    <div
      data-section-key={sectionKey}
      className="h-full flex flex-col overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
    </div>
  )
}

// ─── Text primitives ─────────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-display font-semibold tracking-[0.18em]
                  uppercase text-brand-dark mb-3">
      {children}
    </p>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink
                   leading-tight mb-4 tracking-tight">
      {children}
    </h2>
  )
}

export function Prose({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={`text-base leading-[1.6] text-ink-light ${className}`}>
      {children}
    </p>
  )
}

export function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-2xl sm:text-3xl italic text-ink
                  leading-snug">
      {children}
    </p>
  )
}

export function TagList({
  tags,
  accent = false,
}: {
  tags: string[]
  accent?: boolean
}) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`px-3 py-1.5 text-xs font-serif rounded-lg border
                      transition-colors ${
            accent
              ? 'bg-transparent border-brand-dark text-ink'
              : 'bg-surface-tint border-surface-border text-ink-muted'
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2.5 text-[0.95rem] text-ink-light leading-[1.55]"
        >
          <span className="text-brand mt-[0.5rem] shrink-0 w-1 h-1 rounded-full
                           bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Quote({
  quote,
  context,
  attribution,
}: {
  quote: string
  context?: string
  attribution?: string
}) {
  if (!quote) return null
  return (
    <blockquote className="border-l-2 border-brand pl-5 sm:pl-6 py-1">
      <p className="font-display italic text-lg sm:text-xl text-ink
                    leading-snug">
        &ldquo;{quote}&rdquo;
      </p>
      {(attribution || context) && (
        <p className="mt-3 text-sm text-ink-muted font-serif">
          {attribution && <span className="not-italic">— {attribution}</span>}
          {attribution && context && <span className="mx-2">·</span>}
          {context && <span>{context}</span>}
        </p>
      )}
    </blockquote>
  )
}

// ─── Ask card (used by project, researcher, and lab) ─────────────────────────

export function AskCard({
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
  if (!title && !description) return null
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 sm:p-6
                    hover:border-brand-light transition-colors">
      <div className="flex items-start gap-4">
        <span className="font-display text-xs text-ink-subtle font-semibold
                         tracking-wider pt-1 shrink-0">
          {String(number).padStart(2, '0')}
        </span>
        <div className="flex-1 space-y-2.5">
          {title && (
            <h3 className="font-display font-semibold text-ink text-lg leading-snug">
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
        </div>
      </div>
    </div>
  )
}

// ─── Custom sections (shared across all output types) ────────────────────────

export function CustomSections({
  sections,
}: {
  sections: Array<{ id: string; title: string; content: string }>
}) {
  if (!sections?.length) return null
  return (
    <>
      {sections.map((cs) => (
        <WideSection key={cs.id}>
          {cs.title && <SectionLabel>{cs.title}</SectionLabel>}
          <p className="text-base leading-[1.6] text-ink-light whitespace-pre-wrap
                        max-w-3xl">
            {cs.content}
          </p>
        </WideSection>
      ))}
    </>
  )
}