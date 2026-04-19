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
  return (
    <section data-section-key="identity" className="w-full bg-brand-ghost pt-12 sm:pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
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

  const renderItem = (item: WhatImOpenToContent['items'][0], idx: number) => (
    <div key={idx} className="py-4 border-b border-surface-border last:border-0 last:pb-0 first:pt-0">
      <p className="font-serif text-[1.05rem] leading-[1.65] text-ink-light">
        {item.body}
      </p>
      {(item.interestedLabel || item.forwardLabel) && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-serif text-brand">
          {item.interestedLabel && (
            <a
              href={slug ? `/p/${slug}#reach-out` : '#reach-out'}
              className="underline underline-offset-2 decoration-brand/40
                         hover:decoration-brand transition-colors"
            >
              {item.interestedLabel} ↗
            </a>
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
      {!singleNoteOnly && <CardLabel>What I&apos;m Open To</CardLabel>}
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
      <CardLabel>What I Bring</CardLabel>
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

export function V2ActiveProjects({ content }: { content: ActiveProjectsContent }) {
  if (!content.projects || content.projects.length === 0) return null
  return (
    <Card sectionKey="activeProjects">
      <CardLabel>Active Projects</CardLabel>
      <ul className="space-y-0">
        {content.projects.map((p, i) => (
          <li
            key={i}
            className="py-4 border-b border-surface-border last:border-0 last:pb-0 first:pt-0"
          >
            <a
              href={p.url}
              className="font-display font-semibold text-ink text-base
                         underline underline-offset-2 decoration-surface-border
                         hover:decoration-ink transition-colors"
            >
              {p.title} ↗
            </a>
            {p.oneLine && (
              <p className="mt-1.5 text-sm font-serif text-ink-muted leading-relaxed">
                {p.oneLine}
              </p>
            )}
          </li>
        ))}
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
