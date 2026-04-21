'use client'
import React, { useState } from 'react'
import type {
  IdentityContent,
  WorkStatementContent,
  FreshnessContent,
  TrustStripContent,
  WhatImOpenToContent,
  WhatIBringContent,
  ActiveProjectsContent,
  PerspectiveContent,
  GenericProseContent,
  GenericListContent,
  ResearchAreasContent,
  CurrentFocusContent,
  KeywordsContent,
  ExpertiseContent,
} from '@/lib/sections/profile-types'

// ─── Layout primitives ────────────────────────────────────────────────────────

function Card({
  children,
  sectionKey,
  id,
  className = '',
}: {
  children: React.ReactNode
  sectionKey?: string
  id?: string
  className?: string
}) {
  return (
    <div
      id={id}
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

// ─── Identity band (hero header, no card) ────────────────────────────────────

export function V2Identity({ content }: { content: IdentityContent }) {
  const initials = (content.name ?? '')
    .split(' ')
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section data-section-key="identity" className="w-full bg-brand-ghost pt-12 sm:pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5 sm:gap-8 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white
                            border border-surface-border flex items-center justify-center
                            shrink-0 mt-1">
              <span className="font-display text-xl sm:text-2xl font-bold text-brand">
                {initials}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink
                             leading-[1.05] tracking-tight">
                {content.name}
              </h1>
              <p className="mt-4 text-base sm:text-lg font-serif text-ink-light leading-snug">
                {content.role}
                {content.institution && (
                  <span className="text-ink-subtle"> · {content.institution}</span>
                )}
                {content.group && (
                  <span className="text-ink-subtle"> · {content.group}</span>
                )}
              </p>
              {content.fieldDescriptor && (
                <p className="mt-2 text-base font-serif text-ink-muted">
                  {content.fieldDescriptor}
                </p>
              )}
              {content.links && content.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {content.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-serif text-brand hover:text-brand-dark
                                 underline underline-offset-2 decoration-brand/30
                                 hover:decoration-brand transition-colors"
                    >
                      {link.label || link.url} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <a
            href="https://joinglialink.demo"
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

// ─── About (work statement) ───────────────────────────────────────────────────

export function V2WorkStatement({ content }: { content: WorkStatementContent }) {
  return (
    <Card sectionKey="workStatement">
      <CardLabel>About</CardLabel>
      <div className="space-y-5">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="font-serif text-[1.05rem] leading-[1.65] text-ink-light">
            {p}
          </p>
        ))}
      </div>
    </Card>
  )
}

// ─── About + selected project split layout ────────────────────────────────────

export function V2AboutAndProject({
  workStatement,
  activeProjects,
  onStatusChange,
}: {
  workStatement: WorkStatementContent
  activeProjects: ActiveProjectsContent | null
  onStatusChange?: (index: number, status: 'active' | 'archived') => void
}) {
  const firstProject = activeProjects?.projects?.[0] ?? null

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* About — scrollable when tall */}
      <div
        data-section-key="workStatement"
        className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8
                   flex flex-col h-72"
      >
        <CardLabel>About</CardLabel>
        {workStatement.subtitle && (
          <p className="font-serif italic text-xl text-ink leading-snug mb-4">
            {workStatement.subtitle}
          </p>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-5">
            {workStatement.paragraphs.map((p, i) => (
              <p key={i} className="font-serif text-[1.05rem] leading-[1.65] text-ink-light">{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Most recent project */}
      <div
        data-section-key="activeProjects"
        className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8
                   flex flex-col h-72"
      >
        {firstProject ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase text-brand-dark">
                A Selected Project
              </p>
              <div className="flex items-center gap-3">
                <StatusDot
                  status={firstProject.status}
                  onToggle={onStatusChange
                    ? () => onStatusChange(0, firstProject.status === 'archived' ? 'active' : 'archived')
                    : undefined
                  }
                />
                <button
                  onClick={() =>
                    document.getElementById('active-projects')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="shrink-0 text-xs font-serif text-brand hover:text-brand-dark
                             transition-colors"
                >
                  See more ↓
                </button>
              </div>
            </div>
            <a
              href={firstProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-semibold text-ink text-base leading-snug
                         underline underline-offset-2 decoration-surface-border
                         hover:decoration-ink transition-colors"
            >
              {firstProject.title} ↗
            </a>
            {firstProject.oneLine && (
              <p className="mt-3 text-sm font-serif text-ink-muted leading-relaxed">
                {firstProject.oneLine}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col h-full">
            <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase text-brand-dark mb-4">
              A Selected Project
            </p>
            <p className="text-sm font-serif text-ink-subtle italic">
              No active projects added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Affiliations (trust strip) ───────────────────────────────────────────────

export function V2TrustStrip({ content }: { content: TrustStripContent }) {
  const hasAdvisors     = content.advisors && content.advisors.length > 0
  const hasCollaborators = content.collaborators && content.collaborators.length > 0
  const hasFunding      = !!content.funding
  const hasPapers       = content.linkedPapers && content.linkedPapers.length > 0

  if (!hasAdvisors && !hasCollaborators && !hasFunding && !hasPapers) return null

  return (
    <Card sectionKey="trustStrip">
      <CardLabel>Affiliations</CardLabel>
      <div className="space-y-4 text-sm font-serif text-ink-muted">
        {hasAdvisors && (
          <div>
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-1">
              Advised by
            </p>
            <p>{content.advisors!.join(', ')}</p>
          </div>
        )}
        {hasCollaborators && (
          <div>
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-1">
              Collaborating with
            </p>
            <p>{content.collaborators!.join(', ')}</p>
          </div>
        )}
        {hasFunding && (
          <div>
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-1">
              Funded by
            </p>
            <p>{content.funding}</p>
          </div>
        )}
        {hasPapers && (
          <div>
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-1">
              Papers
            </p>
            <div className="flex flex-col gap-1">
              {content.linkedPapers!.map((p, i) => (
                <span key={i}>
                  <a
                    href={p.url}
                    className="underline underline-offset-2 decoration-surface-border
                               hover:decoration-ink-muted transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.title}
                  </a>
                  {p.note && (
                    <span className="text-ink-subtle ml-1">({p.note})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── What I'm open to ─────────────────────────────────────────────────────────

export function V2WhatImOpenTo({
  content,
  slug,
}: {
  content: WhatImOpenToContent
  slug?: string
}) {
  if (!content.items || content.items.length === 0) return null

  const directAsks      = content.items.filter((i) => i.type === 'direct_ask')
  const openInvitations = content.items.filter((i) => i.type === 'open_invitation')
  const exploratoryNotes = content.items.filter((i) => i.type === 'exploratory_note')

  const singleNoteOnly =
    exploratoryNotes.length === 1 &&
    directAsks.length === 0 &&
    openInvitations.length === 0

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ url })
      } catch {
        // user cancelled or share failed — fall through to clipboard
        await navigator.clipboard.writeText(url).catch(() => {})
      }
    } else {
      await navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  const renderItem = (item: WhatImOpenToContent['items'][0], idx: number) => (
    <div key={idx} className="py-4 border-b border-surface-border last:border-0 last:pb-0 first:pt-0">
      <p className="font-serif text-[1.05rem] leading-[1.65] text-ink-light">
        {item.body}
      </p>
      {(item.interestedLabel || item.forwardLabel) && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-serif text-brand">
          {item.interestedLabel && (
            <button
              onClick={handleShare}
              className="underline underline-offset-2 decoration-brand/40
                         hover:decoration-brand transition-colors text-left"
            >
              {item.interestedLabel} ↗
            </button>
          )}
          {item.forwardLabel && (
            <span className="text-ink-muted">{item.forwardLabel}</span>
          )}
        </div>
      )}
    </div>
  )

  return (
    <Card sectionKey="whatImOpenTo">
      {!singleNoteOnly && <CardLabel>What I&apos;m Looking For</CardLabel>}
      <div className="space-y-0">
        {directAsks.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-3">
              Direct Asks
            </p>
            <div>{directAsks.map(renderItem)}</div>
          </div>
        )}
        {openInvitations.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-3">
              Open Invitations
            </p>
            <div>{openInvitations.map(renderItem)}</div>
          </div>
        )}
        {exploratoryNotes.length > 0 && (
          <div>
            {!singleNoteOnly && (
              <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                            text-ink-subtle mb-3">
                Exploratory Notes
              </p>
            )}
            <div>{exploratoryNotes.map(renderItem)}</div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── What I bring ─────────────────────────────────────────────────────────────

export function V2WhatIBring({ content }: { content: WhatIBringContent }) {
  if (!content.paragraphs || content.paragraphs.length === 0) return null
  return (
    <Card sectionKey="whatIBring">
      <CardLabel>What I Offer</CardLabel>
      <div className="space-y-4">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="font-serif text-[1.05rem] leading-[1.65] text-ink-light">
            {p}
          </p>
        ))}
      </div>
    </Card>
  )
}

// ─── Active projects ──────────────────────────────────────────────────────────

function StatusDot({
  status,
  onToggle,
}: {
  status?: 'active' | 'archived'
  onToggle?: () => void
}) {
  const isArchived = status === 'archived'
  const inner = (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-serif ${
      isArchived ? 'text-ink-subtle' : 'text-emerald-600'
    } ${onToggle ? 'cursor-pointer hover:opacity-70 transition-opacity select-none' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        isArchived ? 'bg-red-400' : 'bg-emerald-500 animate-pulse'
      }`} />
      {isArchived ? 'Archived' : 'Active'}
    </span>
  )
  if (onToggle) {
    return (
      <button
        onClick={onToggle}
        title="Click to toggle status"
        className="focus:outline-none"
      >
        {inner}
      </button>
    )
  }
  return inner
}

export function V2ActiveProjects({
  content,
  onStatusChange,
}: {
  content: ActiveProjectsContent
  onStatusChange?: (index: number, status: 'active' | 'archived') => void
}) {
  if (!content.projects || content.projects.length === 0) return null
  return (
    <Card sectionKey="activeProjects" id="active-projects">
      <CardLabel>Selected Projects</CardLabel>
      <ul className="space-y-0">
        {content.projects.map((p, i) => {
          const allLinks = p.links && p.links.length > 0
            ? p.links
            : p.url && p.url !== '#' ? [{ label: p.title, url: p.url }] : []
          return (
            <li
              key={i}
              className="py-4 border-b border-surface-border last:border-0 last:pb-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-display font-semibold text-ink text-base leading-snug">
                  {p.title}
                </p>
                <StatusDot
                  status={p.status}
                  onToggle={onStatusChange
                    ? () => onStatusChange(i, p.status === 'archived' ? 'active' : 'archived')
                    : undefined
                  }
                />
              </div>
              {p.oneLine && (
                <p className="mt-1.5 text-sm font-serif text-ink-muted leading-relaxed">
                  {p.oneLine}
                </p>
              )}
              {allLinks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {allLinks.map((link, j) => (
                    <a
                      key={j}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-serif text-brand underline underline-offset-2
                                 decoration-brand/40 hover:decoration-brand transition-colors"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

// ─── Perspective ──────────────────────────────────────────────────────────────

export function V2Perspective({ content }: { content: PerspectiveContent }) {
  if (!content.quote && !content.description) return null
  return (
    <Card sectionKey="perspective">
      {content.quote && (
        <blockquote className="border-l-2 border-brand-dark pl-5 sm:pl-6 py-1">
          <p className="font-display italic text-xl sm:text-2xl text-ink leading-snug">
            &ldquo;{content.quote}&rdquo;
          </p>
        </blockquote>
      )}
      {content.description && (
        <p className="mt-5 font-serif text-[0.975rem] text-ink-muted leading-relaxed italic">
          {content.description}
        </p>
      )}
    </Card>
  )
}

// ─── Freshness ────────────────────────────────────────────────────────────────

export function V2Freshness({ content }: { content: FreshnessContent }) {
  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    } catch {
      return iso
    }
  }
  return (
    <div data-section-key="freshness" className="px-1">
      <p className="text-xs font-serif text-ink-subtle">
        Page created {fmt(content.pageCreatedAt)}
        {content.lastEditedAt && content.lastEditedAt !== content.pageCreatedAt && (
          <span> · Last edited {fmt(content.lastEditedAt)}</span>
        )}
      </p>
    </div>
  )
}

// ─── Reach out ────────────────────────────────────────────────────────────────

export function V2ReachOut({ slug }: { slug: string }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [state, setState]     = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setState('sending')
    try {
      const res = await fetch(`/api/p/${slug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      setState(res.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <Card sectionKey="reachOut" id="reach-out">
      <CardLabel>Reach Out</CardLabel>
      {state === 'sent' ? (
        <p className="font-serif text-ink-muted text-sm">Message sent. Thank you.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-serif text-ink-subtle mb-1.5">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Name"
              className="w-full border border-surface-border rounded-lg bg-transparent
                         font-serif text-sm text-ink px-3 py-2 focus:outline-none
                         focus:border-brand-dark transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-serif text-ink-subtle mb-1.5">
              Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="w-full border border-surface-border rounded-lg bg-transparent
                         font-serif text-sm text-ink px-3 py-2 focus:outline-none
                         focus:border-brand-dark transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-serif text-ink-subtle mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="What brings you here?"
              className="w-full border border-surface-border rounded-lg bg-transparent
                         font-serif text-sm text-ink px-3 py-2 focus:outline-none
                         focus:border-brand-dark transition-colors resize-none"
            />
          </div>
          {state === 'error' && (
            <p className="text-xs font-serif text-red-500">Something went wrong. Try again.</p>
          )}
          <button
            type="submit"
            disabled={state === 'sending'}
            className="px-5 py-2 bg-ink text-white font-serif text-sm rounded-lg
                       hover:bg-ink-light transition-colors disabled:opacity-50"
          >
            {state === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </Card>
  )
}

// ─── Research Areas ───────────────────────────────────────────────────────────

export function V2ResearchAreas({ content }: { content: ResearchAreasContent }) {
  if (!content.areas || content.areas.length === 0) return null
  return (
    <Card sectionKey="researchAreas" className="flex flex-col">
      <CardLabel>Research Areas</CardLabel>
      <ul className="space-y-1.5">
        {content.areas.map((area, i) => (
          <li key={i} className="text-sm font-serif text-ink-light leading-relaxed">
            {area}
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ─── Current Focus ────────────────────────────────────────────────────────────

export function V2CurrentFocus({ content }: { content: CurrentFocusContent }) {
  if (!content.headline) return null
  return (
    <Card sectionKey="currentFocus" className="flex flex-col">
      <CardLabel>Current Focus</CardLabel>
      <p className="font-display font-semibold text-ink text-base leading-snug">
        {content.headline}
      </p>
      {content.details && (
        <p className="mt-3 text-sm font-serif text-ink-muted leading-relaxed">
          {content.details}
        </p>
      )}
    </Card>
  )
}

// ─── Keywords ─────────────────────────────────────────────────────────────────

export function V2Keywords({ content }: { content: KeywordsContent }) {
  if (!content.keywords || content.keywords.length === 0) return null
  return (
    <Card sectionKey="keywords" className="flex flex-col">
      <CardLabel>Keywords</CardLabel>
      <div className="flex flex-wrap gap-2">
        {content.keywords.map((kw, i) => (
          <span
            key={i}
            className="inline-block border border-surface-border rounded-full px-3 py-1
                       text-xs font-serif text-ink-muted"
          >
            {kw}
          </span>
        ))}
      </div>
    </Card>
  )
}

// ─── Expertise ────────────────────────────────────────────────────────────────

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-surface-border rounded-lg px-3 py-1.5
                     text-sm font-serif text-ink-muted">
      {children}
    </span>
  )
}

export function V2Expertise({ content }: { content: ExpertiseContent }) {
  const hasSkills  = content.skills  && content.skills.length  > 0
  const hasDomain  = content.domain  && content.domain.length  > 0
  const hasMethods = content.methods && content.methods.length > 0
  if (!hasSkills && !hasDomain && !hasMethods) return null

  return (
    <Card sectionKey="expertise">
      <CardLabel>Expertise</CardLabel>
      <div className="space-y-5">
        {hasSkills && (
          <div>
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-2">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {content.skills!.map((s, i) => <TagPill key={i}>{s}</TagPill>)}
            </div>
          </div>
        )}
        {hasDomain && (
          <div>
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-2">
              Domain
            </p>
            <div className="flex flex-wrap gap-2">
              {content.domain!.map((d, i) => <TagPill key={i}>{d}</TagPill>)}
            </div>
          </div>
        )}
        {hasMethods && (
          <div>
            <p className="text-[11px] font-display font-semibold uppercase tracking-widest
                          text-ink-subtle mb-2">
              Methods
            </p>
            <div className="flex flex-wrap gap-2">
              {content.methods!.map((m, i) => <TagPill key={i}>{m}</TagPill>)}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── Tier 3 sections ──────────────────────────────────────────────────────────

function ProseSection({
  label,
  content,
  sectionKey,
}: {
  label: string
  content: GenericProseContent
  sectionKey: string
}) {
  if (!content.paragraphs || content.paragraphs.length === 0) return null
  return (
    <Card sectionKey={sectionKey}>
      <CardLabel>{label}</CardLabel>
      <div className="space-y-4">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="font-serif text-[1.05rem] leading-[1.65] text-ink-light">{p}</p>
        ))}
      </div>
    </Card>
  )
}

function ListSection({
  label,
  content,
  sectionKey,
}: {
  label: string
  content: GenericListContent
  sectionKey: string
}) {
  if (!content.items || content.items.length === 0) return null
  return (
    <Card sectionKey={sectionKey}>
      <CardLabel>{label}</CardLabel>
      <ul className="space-y-0">
        {content.items.map((item, i) => (
          <li
            key={i}
            className="py-3 border-b border-surface-border last:border-0 last:pb-0
                       first:pt-0 font-serif text-sm text-ink-light leading-relaxed"
          >
            {item}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function V2PastProjects({ content }: { content: GenericProseContent }) {
  return <ProseSection label="Past Projects" content={content} sectionKey="pastProjects" />
}

export function V2SelectedPublications({ content }: { content: GenericListContent }) {
  return <ListSection label="Selected Publications" content={content} sectionKey="selectedPublications" />
}

export function V2TalksAndAppearances({ content }: { content: GenericListContent }) {
  return <ListSection label="Talks & Appearances" content={content} sectionKey="talksAndAppearances" />
}

export function V2WritingAndMedia({ content }: { content: GenericListContent }) {
  return <ListSection label="Writing & Media" content={content} sectionKey="writingAndMedia" />
}

export function V2TeachingAndMentorship({ content }: { content: GenericProseContent }) {
  return <ProseSection label="Teaching & Mentorship" content={content} sectionKey="teachingAndMentorship" />
}

export function V2Background({ content }: { content: GenericProseContent }) {
  return <ProseSection label="Background" content={content} sectionKey="background" />
}

export function V2Education({ content }: { content: GenericListContent }) {
  return <ListSection label="Education" content={content} sectionKey="education" />
}

export function V2CreativeSection({ label, content, sectionKey }: {
  label: string
  content: GenericProseContent
  sectionKey: string
}) {
  return <ProseSection label={label} content={content} sectionKey={sectionKey} />
}
