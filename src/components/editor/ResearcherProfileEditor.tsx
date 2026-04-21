'use client'
import React, { useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import { useProfileEditorStore } from './ProfileEditorStore'
import { SECTION_REGISTRY, TIER_1_KEYS, TIER_2_KEYS, TIER_3_KEYS } from '@/lib/sections/registry'
import type { ResearcherProfileV2Sections, EditDraft } from '@/lib/sections/profile-types'
import type { SectionSuggestion } from '@/lib/types'

// ─── Preview (published view) ─────────────────────────────────────────────────

import {
  V2Identity,
  V2AboutAndProject,
  V2TrustStrip,
  V2ResearchAreas,
  V2CurrentFocus,
  V2Keywords,
  V2Expertise,
  V2WhatImOpenTo,
  V2WhatIBring,
  V2ActiveProjects,
  V2Perspective,
  V2Freshness,
  V2PastProjects,
  V2SelectedPublications,
  V2TalksAndAppearances,
  V2WritingAndMedia,
  V2TeachingAndMentorship,
  V2Background,
  V2Education,
  V2CreativeSection,
} from '@/components/public/researcher-v2-sections'

// ─── Field editors ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-display font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
      {children}
    </p>
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-neutral-200 rounded px-3 py-2 text-sm
                 font-serif text-neutral-800 bg-white focus:outline-none
                 focus:border-neutral-400 resize-none transition-colors leading-relaxed"
    />
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-neutral-200 rounded px-3 py-2 text-sm
                 font-serif text-neutral-800 bg-white focus:outline-none
                 focus:border-neutral-400 transition-colors"
    />
  )
}

// Edits an array of paragraphs stored as a JSON array
function ParagraphsEditor({
  paragraphs,
  onChange,
  placeholder = 'Add a paragraph…',
}: {
  paragraphs: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const update = (i: number, v: string) => {
    const next = [...paragraphs]
    next[i] = v
    onChange(next)
  }
  const add = () => onChange([...paragraphs, ''])
  const remove = (i: number) => onChange(paragraphs.filter((_, j) => j !== i))

  return (
    <div className="space-y-2">
      {paragraphs.map((p, i) => (
        <div key={i} className="relative group">
          <TextArea value={p} onChange={(v) => update(i, v)} placeholder={placeholder} rows={3} />
          {paragraphs.length > 1 && (
            <button
              onClick={() => remove(i)}
              className="absolute top-2 right-2 text-neutral-300 hover:text-neutral-500
                         text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        onClick={add}
        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        + Add paragraph
      </button>
    </div>
  )
}

// Edits a newline-separated list of strings
function LineListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  return (
    <TextArea
      value={items.join('\n')}
      onChange={(v) => onChange(v.split('\n'))}
      placeholder={placeholder}
      rows={3}
    />
  )
}

// ─── Per-section content editors ─────────────────────────────────────────────

function SectionEditorIdentity({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as {
    name?: string; role?: string; institution?: string; group?: string; fieldDescriptor?: string
    links?: Array<{ label: string; url: string }>
  }
  const u = (k: string) => (v: string) => onChange({ ...c, [k]: v })
  const links = c.links ?? []
  const updateLink = (i: number, patch: Partial<{ label: string; url: string }>) => {
    const next = [...links]
    next[i] = { ...next[i], ...patch }
    onChange({ ...c, links: next })
  }
  const addLink = () => onChange({ ...c, links: [...links, { label: '', url: '' }] })
  const removeLink = (i: number) => onChange({ ...c, links: links.filter((_, j) => j !== i) })

  return (
    <div className="space-y-3">
      {(['name', 'role', 'institution', 'group', 'fieldDescriptor'] as const).map((k) => (
        <div key={k}>
          <FieldLabel>{k === 'fieldDescriptor' ? 'Field descriptor' : k.charAt(0).toUpperCase() + k.slice(1)}</FieldLabel>
          <TextInput value={c[k] ?? ''} onChange={u(k)} placeholder={k} />
        </div>
      ))}

      <div>
        <FieldLabel>Links</FieldLabel>
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="border border-neutral-200 rounded p-2 space-y-1.5">
              <div className="flex justify-end">
                <button
                  onClick={() => removeLink(i)}
                  className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div>
                <FieldLabel>Label</FieldLabel>
                <TextInput value={link.label} onChange={(v) => updateLink(i, { label: v })} placeholder="e.g. Lab website" />
              </div>
              <div>
                <FieldLabel>URL</FieldLabel>
                <TextInput value={link.url} onChange={(v) => updateLink(i, { url: v })} placeholder="https://…" />
              </div>
            </div>
          ))}
          <button
            onClick={addLink}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            + Add link
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionEditorWorkStatement({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { subtitle?: string; paragraphs?: string[] }
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Subtitle (italic tagline in About card)</FieldLabel>
        <TextInput
          value={c.subtitle ?? ''}
          onChange={(v) => onChange({ ...c, subtitle: v || undefined })}
          placeholder="e.g. How do neurons encode time?"
        />
      </div>
      <div>
        <FieldLabel>Paragraphs</FieldLabel>
        <ParagraphsEditor
          paragraphs={c.paragraphs ?? ['']}
          onChange={(v) => onChange({ ...c, paragraphs: v })}
          placeholder="Describe your work…"
        />
      </div>
    </div>
  )
}

function SectionEditorTrustStrip({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as {
    advisors?: string[]
    collaborators?: string[]
    funding?: string
    linkedPapers?: Array<{ title: string; url: string; note?: string }>
  }
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Advisors (one per line)</FieldLabel>
        <LineListEditor
          items={c.advisors ?? []}
          onChange={(v) => onChange({ ...c, advisors: v.filter(Boolean) })}
          placeholder="Name (Institution)"
        />
      </div>
      <div>
        <FieldLabel>Collaborators (one per line)</FieldLabel>
        <LineListEditor
          items={c.collaborators ?? []}
          onChange={(v) => onChange({ ...c, collaborators: v.filter(Boolean) })}
          placeholder="Name or group"
        />
      </div>
      <div>
        <FieldLabel>Funding</FieldLabel>
        <TextInput
          value={c.funding ?? ''}
          onChange={(v) => onChange({ ...c, funding: v })}
          placeholder="Funder name"
        />
      </div>
      <div>
        <FieldLabel>Linked papers (JSON array: [{'{'}title, url, note{'}'}, …])</FieldLabel>
        <TextArea
          value={JSON.stringify(c.linkedPapers ?? [], null, 2)}
          onChange={(v) => {
            try { onChange({ ...c, linkedPapers: JSON.parse(v) }) } catch { /* ignore malformed */ }
          }}
          rows={4}
          placeholder='[{"title": "...", "url": "...", "note": "..."}]'
        />
      </div>
    </div>
  )
}

function SectionEditorWhatImOpenTo({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { items?: Array<{ type: string; body: string; interestedLabel?: string; forwardLabel?: string }> }
  const items = c.items ?? []
  const updateItem = (i: number, patch: Partial<typeof items[0]>) => {
    const next = [...items]
    next[i] = { ...next[i], ...patch }
    onChange({ ...c, items: next })
  }
  const addItem = () => onChange({ ...c, items: [...items, { type: 'exploratory_note', body: '' }] })
  const removeItem = (i: number) => onChange({ ...c, items: items.filter((_, j) => j !== i) })

  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="border border-neutral-200 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <select
              value={item.type}
              onChange={(e) => updateItem(i, { type: e.target.value })}
              className="text-xs border border-neutral-200 rounded px-2 py-1 bg-white
                         text-neutral-600 focus:outline-none"
            >
              <option value="direct_ask">Direct Ask</option>
              <option value="open_invitation">Open Invitation</option>
              <option value="exploratory_note">Exploratory Note</option>
            </select>
            <button
              onClick={() => removeItem(i)}
              className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors"
            >
              Remove
            </button>
          </div>
          <TextArea
            value={item.body}
            onChange={(v) => updateItem(i, { body: v })}
            placeholder="Describe what you're open to…"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Interested label</FieldLabel>
              <TextInput
                value={item.interestedLabel ?? ''}
                onChange={(v) => updateItem(i, { interestedLabel: v })}
                placeholder="e.g. Say hi"
              />
            </div>
            <div>
              <FieldLabel>Forward label</FieldLabel>
              <TextInput
                value={item.forwardLabel ?? ''}
                onChange={(v) => updateItem(i, { forwardLabel: v })}
                placeholder="e.g. Know someone? Forward"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        + Add item
      </button>
    </div>
  )
}

function SectionEditorWhatIBring({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { paragraphs?: string[] }
  return (
    <div>
      <FieldLabel>Paragraphs</FieldLabel>
      <ParagraphsEditor
        paragraphs={c.paragraphs ?? ['']}
        onChange={(v) => onChange({ ...c, paragraphs: v })}
        placeholder="What do you bring to collaborators?"
      />
    </div>
  )
}

function SectionEditorActiveProjects({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  type ProjectLink = { label: string; url: string }
  type Project = { title: string; oneLine: string; url: string; status?: 'active' | 'archived'; links?: ProjectLink[] }
  const c = content as { projects?: Project[] }
  const projects = c.projects ?? []

  const updateProject = (i: number, patch: Partial<Project>) => {
    const next = [...projects]
    next[i] = { ...next[i], ...patch }
    onChange({ ...c, projects: next })
  }
  const addProject = () => onChange({ ...c, projects: [...projects, { title: '', oneLine: '', url: '', links: [] }] })
  const removeProject = (i: number) => onChange({ ...c, projects: projects.filter((_, j) => j !== i) })

  const updateLink = (pi: number, li: number, patch: Partial<ProjectLink>) => {
    const proj = projects[pi]
    const links = [...(proj.links ?? [])]
    links[li] = { ...links[li], ...patch }
    updateProject(pi, { links })
  }
  const addLink = (pi: number) => updateProject(pi, { links: [...(projects[pi].links ?? []), { label: '', url: '' }] })
  const removeLink = (pi: number, li: number) => updateProject(pi, { links: (projects[pi].links ?? []).filter((_, j) => j !== li) })

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-neutral-400 leading-relaxed">
        The <span className="font-semibold text-neutral-500">first project</span> is
        featured in the &ldquo;A Selected Project&rdquo; card at the top of your profile.
        Add more to build the full Selected Projects list below it.
      </p>

      {projects.length === 0 ? (
        <button
          onClick={addProject}
          className="w-full border border-dashed border-neutral-200 rounded px-4 py-3
                     text-xs text-neutral-400 hover:text-neutral-600 hover:border-neutral-300
                     transition-colors text-left"
        >
          + Add your first project — it will appear in the featured card
        </button>
      ) : (
        <>
          {projects.map((p, i) => (
            <div
              key={i}
              className={`border rounded p-3 space-y-2 ${
                i === 0 ? 'border-brand/40 bg-brand-ghost' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                {i === 0 && (
                  <span className="text-[10px] font-display font-semibold uppercase
                                   tracking-wider text-brand-dark">
                    Featured in card
                  </span>
                )}
                <button
                  onClick={() => removeProject(i)}
                  className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors ml-auto"
                >
                  Remove
                </button>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput value={p.title} onChange={(v) => updateProject(i, { title: v })} placeholder="Project title" />
              </div>
              <div>
                <FieldLabel>One-line description</FieldLabel>
                <TextInput value={p.oneLine} onChange={(v) => updateProject(i, { oneLine: v })} placeholder="One sentence" />
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="flex gap-2">
                  {(['active', 'archived'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateProject(i, { status: s })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-serif border transition-colors ${
                        (p.status ?? 'active') === s
                          ? s === 'active'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-red-400 bg-red-50 text-red-600'
                          : 'border-neutral-200 text-neutral-400 hover:border-neutral-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s === 'active' ? 'bg-emerald-500' : 'bg-red-400'
                      }`} />
                      {s === 'active' ? 'Active' : 'Archived'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div>
                <FieldLabel>Links</FieldLabel>
                <div className="space-y-2">
                  {(p.links ?? []).map((link, li) => (
                    <div key={li} className="border border-neutral-200 rounded p-2 space-y-1.5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeLink(i, li)}
                          className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <FieldLabel>Label</FieldLabel>
                        <TextInput value={link.label} onChange={(v) => updateLink(i, li, { label: v })} placeholder="e.g. Project page" />
                      </div>
                      <div>
                        <FieldLabel>URL</FieldLabel>
                        <TextInput value={link.url} onChange={(v) => updateLink(i, li, { url: v })} placeholder="https://…" />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addLink(i)}
                    className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    + Add link
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addProject}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            + Add another project
          </button>
        </>
      )}
    </div>
  )
}

function SectionEditorResearchAreas({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { areas?: string[] }
  return (
    <div>
      <FieldLabel>Areas (one per line)</FieldLabel>
      <LineListEditor
        items={c.areas ?? []}
        onChange={(v) => onChange({ ...c, areas: v.filter(Boolean) })}
        placeholder="e.g. Computational neuroscience"
      />
    </div>
  )
}

function SectionEditorCurrentFocus({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { headline?: string; details?: string }
  return (
    <div className="space-y-3">
      <div>
        <FieldLabel>Headline</FieldLabel>
        <TextInput
          value={c.headline ?? ''}
          onChange={(v) => onChange({ ...c, headline: v })}
          placeholder="What are you currently focused on?"
        />
      </div>
      <div>
        <FieldLabel>Details (optional)</FieldLabel>
        <TextArea
          value={c.details ?? ''}
          onChange={(v) => onChange({ ...c, details: v })}
          placeholder="More context…"
          rows={2}
        />
      </div>
    </div>
  )
}

function SectionEditorKeywords({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { keywords?: string[] }
  return (
    <div>
      <FieldLabel>Keywords (one per line)</FieldLabel>
      <LineListEditor
        items={c.keywords ?? []}
        onChange={(v) => onChange({ ...c, keywords: v.filter(Boolean) })}
        placeholder="e.g. fMRI, deep learning, protein folding"
      />
    </div>
  )
}

function SectionEditorExpertise({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { skills?: string[]; domain?: string[]; methods?: string[] }
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Skills (one per line)</FieldLabel>
        <LineListEditor
          items={c.skills ?? []}
          onChange={(v) => onChange({ ...c, skills: v.filter(Boolean) })}
          placeholder="e.g. Python, data analysis"
        />
      </div>
      <div>
        <FieldLabel>Domain (one per line)</FieldLabel>
        <LineListEditor
          items={c.domain ?? []}
          onChange={(v) => onChange({ ...c, domain: v.filter(Boolean) })}
          placeholder="e.g. Neuroscience, machine learning"
        />
      </div>
      <div>
        <FieldLabel>Methods (one per line)</FieldLabel>
        <LineListEditor
          items={c.methods ?? []}
          onChange={(v) => onChange({ ...c, methods: v.filter(Boolean) })}
          placeholder="e.g. fMRI, CRISPR, Bayesian inference"
        />
      </div>
    </div>
  )
}

function SectionEditorPerspective({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { quote?: string; description?: string }
  return (
    <div className="space-y-3">
      <div>
        <FieldLabel>Quote</FieldLabel>
        <TextArea
          value={c.quote ?? ''}
          onChange={(v) => onChange({ ...c, quote: v })}
          placeholder="A direct quote…"
          rows={2}
        />
      </div>
      <div>
        <FieldLabel>Description</FieldLabel>
        <TextArea
          value={c.description ?? ''}
          onChange={(v) => onChange({ ...c, description: v })}
          placeholder="Third-person characterization…"
          rows={3}
        />
      </div>
    </div>
  )
}

function SectionEditorGenericProse({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { paragraphs?: string[] }
  return (
    <ParagraphsEditor
      paragraphs={c.paragraphs ?? ['']}
      onChange={(v) => onChange({ ...c, paragraphs: v })}
    />
  )
}

function SectionEditorGenericList({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const c = content as { items?: string[] }
  return (
    <LineListEditor
      items={c.items ?? []}
      onChange={(v) => onChange({ ...c, items: v.filter(Boolean) })}
      placeholder="One item per line"
    />
  )
}

const SECTION_EDITORS: Record<string, React.ComponentType<{
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}>> = {
  identity:              SectionEditorIdentity,
  workStatement:         SectionEditorWorkStatement,
  researchAreas:         SectionEditorResearchAreas,
  currentFocus:          SectionEditorCurrentFocus,
  keywords:              SectionEditorKeywords,
  expertise:             SectionEditorExpertise,
  trustStrip:            SectionEditorTrustStrip,
  whatImOpenTo:          SectionEditorWhatImOpenTo,
  whatIBring:            SectionEditorWhatIBring,
  activeProjects:        SectionEditorActiveProjects,
  perspective:           SectionEditorPerspective,
  pastProjects:          SectionEditorGenericProse,
  selectedPublications:  SectionEditorGenericList,
  talksAndAppearances:   SectionEditorGenericList,
  writingAndMedia:       SectionEditorGenericList,
  teachingAndMentorship: SectionEditorGenericProse,
  background:            SectionEditorGenericProse,
  education:             SectionEditorGenericList,
}

// ─── Section block ────────────────────────────────────────────────────────────

function SectionBlock({
  sectionKey,
  isRemovable,
  onRemove,
}: {
  sectionKey: string
  isRemovable: boolean
  onRemove?: () => void
}) {
  const def = SECTION_REGISTRY[sectionKey]
  const { draft, updateSectionContent } = useProfileEditorStore()
  const content = draft.sections[sectionKey]?.content ?? {}
  const EditorComponent = SECTION_EDITORS[sectionKey] ?? SectionEditorGenericProse

  const handleChange = useCallback(
    (c: Record<string, unknown>) => updateSectionContent(sectionKey, c),
    [sectionKey, updateSectionContent]
  )

  const isEmpty = Object.keys(content).length === 0

  return (
    <div className="border-t border-neutral-100 py-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-display font-semibold uppercase tracking-wider text-neutral-400">
            {def?.label ?? (content as { _sectionLabel?: string })._sectionLabel ?? sectionKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
          {def?.tier === 1 && (
            <p className="text-[10px] text-neutral-300 mt-0.5">Required</p>
          )}
        </div>
        {isRemovable && onRemove && (
          <button
            onClick={onRemove}
            className="text-[11px] text-neutral-300 hover:text-red-400 transition-colors ml-4 shrink-0"
          >
            Remove section
          </button>
        )}
      </div>

      {EditorComponent ? (
        <EditorComponent content={content} onChange={handleChange} />
      ) : (
        <p className="text-sm text-neutral-400 italic">{def?.emptyPrompt ?? 'Edit this section.'}</p>
      )}

      {isEmpty && def?.emptyPrompt && (
        <p className="mt-2 text-xs text-neutral-300 italic">{def.emptyPrompt}</p>
      )}
    </div>
  )
}

// ─── Empty section placeholder (preview only) ────────────────────────────────

function EmptySectionPlaceholder({ label }: { label: string }) {
  return (
    <div className="bg-white border border-dashed border-surface-border rounded-2xl p-6 sm:p-8">
      <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase text-brand-dark mb-2">
        {label}
      </p>
      <p className="text-sm font-serif text-ink-subtle italic">
        Section added — fill in the editor to see it here.
      </p>
    </div>
  )
}

// ─── Preview panel ────────────────────────────────────────────────────────────

function PreviewPanel({ slug, publishedSections }: {
  slug: string
  publishedSections: Record<string, unknown>
}) {
  const { getDraftSectionsForPreview, draft, updateSectionContent } = useProfileEditorStore()
  const previewSections = getDraftSectionsForPreview()

  const merged = { _v2: true, ...publishedSections, ...previewSections } as unknown as ResearcherProfileV2Sections

  const g = <T,>(key: keyof ResearcherProfileV2Sections) =>
    (merged[key] as { content: T } | undefined)?.content ?? null

  const inDraft = (key: string) => draft.activeSections.includes(key)

  const identity       = g<Parameters<typeof V2Identity>[0]['content']>('identity')
  const workStatement  = g<Parameters<typeof V2AboutAndProject>[0]['workStatement']>('workStatement')
  const freshness      = g<Parameters<typeof V2Freshness>[0]['content']>('freshness')
  const researchAreas  = g<Parameters<typeof V2ResearchAreas>[0]['content']>('researchAreas')
  const currentFocus   = g<Parameters<typeof V2CurrentFocus>[0]['content']>('currentFocus')
  const keywords       = g<Parameters<typeof V2Keywords>[0]['content']>('keywords')
  const expertise      = inDraft('expertise') ? g<Parameters<typeof V2Expertise>[0]['content']>('expertise') : null
  const trustStrip     = inDraft('trustStrip') ? g<Parameters<typeof V2TrustStrip>[0]['content']>('trustStrip') : null
  const whatImOpenTo   = inDraft('whatImOpenTo') ? g<Parameters<typeof V2WhatImOpenTo>[0]['content']>('whatImOpenTo') : null
  const whatIBring     = inDraft('whatIBring') ? g<Parameters<typeof V2WhatIBring>[0]['content']>('whatIBring') : null
  const activeProjects = inDraft('activeProjects') ? g<Parameters<typeof V2ActiveProjects>[0]['content']>('activeProjects') : null
  const perspective    = inDraft('perspective') ? g<Parameters<typeof V2Perspective>[0]['content']>('perspective') : null
  const pastProjects   = inDraft('pastProjects') ? g<Parameters<typeof V2PastProjects>[0]['content']>('pastProjects') : null
  const selectedPubs   = inDraft('selectedPublications') ? g<Parameters<typeof V2SelectedPublications>[0]['content']>('selectedPublications') : null
  const talks          = inDraft('talksAndAppearances') ? g<Parameters<typeof V2TalksAndAppearances>[0]['content']>('talksAndAppearances') : null
  const writing        = inDraft('writingAndMedia') ? g<Parameters<typeof V2WritingAndMedia>[0]['content']>('writingAndMedia') : null
  const teaching       = inDraft('teachingAndMentorship') ? g<Parameters<typeof V2TeachingAndMentorship>[0]['content']>('teachingAndMentorship') : null
  const background     = inDraft('background') ? g<Parameters<typeof V2Background>[0]['content']>('background') : null
  const education      = inDraft('education') ? g<Parameters<typeof V2Education>[0]['content']>('education') : null

  const handleStatusChange = useCallback(
    (index: number, status: 'active' | 'archived') => {
      if (!activeProjects) return
      const projects = activeProjects.projects.map((p, i) =>
        i === index ? { ...p, status } : p
      )
      updateSectionContent('activeProjects', { ...activeProjects, projects })
    },
    [activeProjects, updateSectionContent]
  )

  const hasTwoColRow = whatImOpenTo || whatIBring

  return (
    <div className="min-h-screen bg-white text-ink font-serif antialiased">
      {identity && <V2Identity content={identity} />}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4 pb-16">
        {workStatement && (
          <V2AboutAndProject
            workStatement={workStatement}
            activeProjects={activeProjects}
            onStatusChange={handleStatusChange}
          />
        )}
        <div className="grid grid-cols-3 gap-4 items-stretch">
          {researchAreas
            ? <V2ResearchAreas content={researchAreas} />
            : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />}
          {currentFocus
            ? <V2CurrentFocus content={currentFocus} />
            : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />}
          {keywords
            ? <V2Keywords content={keywords} />
            : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />}
        </div>
        {expertise && <V2Expertise content={expertise} />}
        {hasTwoColRow && (
          <div className="grid grid-cols-2 gap-4 items-stretch">
            {whatImOpenTo
              ? <V2WhatImOpenTo content={whatImOpenTo} slug={slug} />
              : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />}
            {whatIBring
              ? <V2WhatIBring content={whatIBring} />
              : <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8" />}
          </div>
        )}
        {activeProjects && (
          <V2ActiveProjects content={activeProjects} onStatusChange={handleStatusChange} />
        )}
        {trustStrip && <V2TrustStrip content={trustStrip} />}
        {perspective && <V2Perspective content={perspective} />}
        {inDraft('pastProjects') && (pastProjects ? <V2PastProjects content={pastProjects} /> : <EmptySectionPlaceholder label="Past Projects" />)}
        {inDraft('selectedPublications') && (selectedPubs ? <V2SelectedPublications content={selectedPubs} /> : <EmptySectionPlaceholder label="Selected Publications" />)}
        {inDraft('talksAndAppearances') && (talks ? <V2TalksAndAppearances content={talks} /> : <EmptySectionPlaceholder label="Talks & Appearances" />)}
        {inDraft('writingAndMedia') && (writing ? <V2WritingAndMedia content={writing} /> : <EmptySectionPlaceholder label="Writing & Media" />)}
        {inDraft('teachingAndMentorship') && (teaching ? <V2TeachingAndMentorship content={teaching} /> : <EmptySectionPlaceholder label="Teaching & Mentorship" />)}
        {inDraft('background') && (background ? <V2Background content={background} /> : <EmptySectionPlaceholder label="Background" />)}
        {inDraft('education') && (education ? <V2Education content={education} /> : <EmptySectionPlaceholder label="Education" />)}

        {/* Creative / custom sections — any activeSections key not in the known registries */}
        {draft.activeSections
          .filter((key) => !TIER_1_KEYS.includes(key) && !TIER_2_KEYS.includes(key) && !TIER_3_KEYS.includes(key))
          .map((key) => {
            const c = previewSections[key]?.content as { paragraphs?: string[]; _sectionLabel?: string } | undefined
            const label = c?._sectionLabel ?? key.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())
            return c?.paragraphs?.length
              ? <V2CreativeSection key={key} label={label} content={{ paragraphs: c.paragraphs }} sectionKey={key} />
              : <EmptySectionPlaceholder key={key} label={label} />
          })}

        {freshness && <V2Freshness content={freshness} />}
      </div>
    </div>
  )
}

// ─── Add section menu ─────────────────────────────────────────────────────────

function AddSectionMenu() {
  const { draft, addTier3Section } = useProfileEditorStore()
  const available = TIER_3_KEYS.filter((k) => !draft.activeSections.includes(k))
  if (available.length === 0) return null

  return (
    <div className="border-t border-neutral-100 pt-6">
      <p className="text-xs text-neutral-400 mb-3">Add a section</p>
      <div className="flex flex-wrap gap-2">
        {available.map((key) => (
          <button
            key={key}
            onClick={() => addTier3Section(key)}
            className="text-xs border border-neutral-200 rounded px-3 py-1.5
                       text-neutral-500 hover:border-neutral-400 hover:text-neutral-700
                       transition-colors"
          >
            + {SECTION_REGISTRY[key]?.label ?? key}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Suggested sections panel ─────────────────────────────────────────────────

const LIST_TIER3_KEYS = new Set(['selectedPublications', 'talksAndAppearances', 'writingAndMedia', 'education'])

function SuggestedSectionsPanel() {
  const [open, setOpen] = useState(true)
  const {
    draft,
    sectionSuggestions,
    dismissedSuggestions,
    addTier3Section,
    updateSectionContent,
    dismissSuggestion,
  } = useProfileEditorStore()

  const visible = sectionSuggestions.filter(
    (s) =>
      !draft.activeSections.includes(s.section_key) &&
      !dismissedSuggestions.includes(s.section_key)
  )

  if (visible.length === 0) return null

  const handleAdd = (s: { section_key: string; label: string; content_hint: string }) => {
    addTier3Section(s.section_key)
    const text = s.content_hint ?? ''
    if (text) {
      const isListKey = LIST_TIER3_KEYS.has(s.section_key)
      const content = isListKey
        ? { items: [text], _sectionLabel: s.label }
        : { paragraphs: [text], _sectionLabel: s.label }
      updateSectionContent(s.section_key, content)
    }
    dismissSuggestion(s.section_key)
  }

  return (
    <div className="border-t border-neutral-100 pt-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-xs text-neutral-400
                   hover:text-neutral-600 transition-colors mb-3"
      >
        <span>💡 Suggested additions ({visible.length})</span>
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="max-h-80 overflow-y-auto space-y-3">
          {visible.map((s) => (
            <div
              key={s.section_key}
              className="border border-brand-soft/40 bg-brand-ghost rounded-lg p-3 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-display font-semibold text-brand-dark uppercase tracking-wider">
                  {s.label}
                </p>
                <button
                  onClick={() => dismissSuggestion(s.section_key)}
                  className="text-neutral-300 hover:text-neutral-500 transition-colors shrink-0 text-sm leading-none"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
              <p className="text-xs font-serif text-ink-muted leading-relaxed">{s.reason}</p>
              {s.content_hint && (
                <p className="text-[11px] font-serif text-ink-light leading-relaxed border-l-2 border-brand/20 pl-2">
                  {s.content_hint}
                </p>
              )}
              <button
                onClick={() => handleAdd(s)}
                className="mt-1 text-xs border border-brand/40 text-brand rounded px-3 py-1
                           hover:bg-brand hover:text-white transition-colors"
              >
                + Add section
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main editor ──────────────────────────────────────────────────────────────

interface Props {
  slug: string
  artifactId: string
  initialSections: Record<string, unknown>
  initialDraft: EditDraft | null
  researcherName: string
  initialSuggestions?: SectionSuggestion[]
}

export function ResearcherProfileEditor({
  slug,
  artifactId,
  initialSections,
  initialDraft,
  researcherName,
  initialSuggestions,
}: Props) {
  const {
    initFromSections,
    draft,
    isDirty,
    isSaving,
    isPublishing,
    previewMode,
    setPreviewMode,
    setIsSaving,
    setIsPublishing,
    setIsDirty,
    removeSection,
    setSectionSuggestions,
  } = useProfileEditorStore()

  useEffect(() => {
    initFromSections(initialSections, initialDraft)
    setSectionSuggestions(initialSuggestions ?? [])
  }, [artifactId])

  const handleSave = async () => {
    setIsSaving(true)
    await fetch(`/api/p/${slug}/save`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft }),
    })
    setIsSaving(false)
    setIsDirty(false)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    await fetch(`/api/p/${slug}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft }),
    })
    setIsPublishing(false)
    setIsDirty(false)
    // Reload the published page
    window.location.href = `/p/${slug}`
  }

  const allActiveSections = [
    ...TIER_1_KEYS.filter((k) => k !== 'freshness' && k !== 'reachOut'),
    ...draft.activeSections.filter((k) => !TIER_1_KEYS.includes(k)),
  ]

  if (previewMode) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-200
                        px-6 py-3 flex items-center gap-4 text-sm">
          <button
            onClick={() => setPreviewMode(false)}
            className="text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Back to editing
          </button>
          <span className="text-neutral-300">|</span>
          <span className="text-neutral-400 text-xs">Preview — this is exactly what visitors see</span>
        </div>
        <PreviewPanel slug={slug} publishedSections={initialSections} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200
                      px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/p/${slug}`}
            className="text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
          >
            ← View profile
          </Link>
          <span className="text-neutral-200">|</span>
          <span className="text-neutral-600 font-medium truncate">{researcherName}</span>
          {isDirty && <span className="text-amber-500 text-xs shrink-0">Unsaved changes</span>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setPreviewMode(true)}
            className="text-xs text-neutral-500 hover:text-neutral-800 border border-neutral-200
                       rounded px-3 py-1.5 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="text-xs text-neutral-500 hover:text-neutral-800 border border-neutral-200
                       rounded px-3 py-1.5 transition-colors disabled:opacity-40"
          >
            {isSaving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="text-xs bg-ink text-white rounded px-4 py-1.5
                       hover:bg-ink-light transition-colors disabled:opacity-40"
          >
            {isPublishing ? 'Publishing…' : 'Publish changes'}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="max-w-[720px] mx-auto px-6 sm:px-8 pb-24">
        {allActiveSections.map((key) => (
          <SectionBlock
            key={key}
            sectionKey={key}
            isRemovable={TIER_2_KEYS.includes(key) || (!TIER_1_KEYS.includes(key) && !TIER_2_KEYS.includes(key) && !TIER_3_KEYS.includes(key))}
            onRemove={() => removeSection(key)}
          />
        ))}

        <SuggestedSectionsPanel />
        <AddSectionMenu />
      </div>
    </div>
  )
}
