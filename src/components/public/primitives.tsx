import React from 'react'

// ─── Layout primitives ───────────────────────────────────────────────────────

export function SectionWrapper({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={`py-10 sm:py-12 border-b border-canvas-border ${className}`}
    >
      {children}
    </section>
  )
}

export function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-[11px] font-sans font-semibold tracking-[0.18em]
                  uppercase text-brand mb-4 ${className}`}
    >
      {children}
    </p>
  )
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink
                   leading-tight mb-5">
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
    <p
      className={`text-base leading-[1.7] text-ink-light ${className}`}
      style={{ hyphens: 'auto' }}
    >
      {children}
    </p>
  )
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 text-xs font-sans bg-brand-mist
                     border border-canvas-border text-brand-deep rounded-full"
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
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-base text-ink-light leading-relaxed">
          <span className="text-brand mt-2 shrink-0">
            <span className="block w-1.5 h-1.5 rounded-full bg-brand" />
          </span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Pullquote({
  quote,
  attribution,
}: {
  quote: string
  attribution?: string
}) {
  if (!quote) return null
  return (
    <blockquote className="border-l-[3px] border-brand pl-5 sm:pl-6 py-1">
      <p className="font-display italic text-xl sm:text-2xl text-ink
                    leading-snug">
        &ldquo;{quote}&rdquo;
      </p>
      {attribution && (
        <p className="mt-3 text-sm text-ink-muted font-sans not-italic">
          — {attribution}
        </p>
      )}
    </blockquote>
  )
}

export function InlineMeta({ items }: { items: (string | null | undefined)[] }) {
  const filtered = items.filter(Boolean) as string[]
  if (filtered.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm
                    text-ink-muted font-sans">
      {filtered.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-ink-fade">·</span>}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </div>
  )
}

export function StatusPill({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-mist
                    border border-brand-soft/30 rounded-full">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full
                         rounded-full bg-brand opacity-50" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
      </span>
      <span className="text-xs font-sans font-medium text-brand-deep">
        {text}
      </span>
    </div>
  )
}