'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels'
import { useEditorStore, SectionData } from './useEditorStore'
import { useGenerationPoller } from './useGenerationPoller'
import { useUnsavedWarning } from './useUnsavedWarning'
import { PagePreview } from './PagePreview'
import { SectionPanel } from './SectionPanel'
import { CustomSectionAdder } from './CustomSectionAdder'
import type { Artifact, Researcher } from '@/lib/types'

interface Props {
  artifact: Artifact & { researchers: Researcher }
}

export function DraftEditor({ artifact }: Props) {
  const router = useRouter()
  const {
    initSections,
    sections,
    customSections,
    setIsSaving,
    setIsPublishing,
    setIsDirty,
    updateSection,
  } = useEditorStore()

  const [bottomCollapsed, setBottomCollapsed] = useState(false)

  const isDirty = useEditorStore((state) => state.isDirty)
  useUnsavedWarning(isDirty)

  useEffect(() => {
    const { custom_sections, ...mainSections } = (artifact.sections ?? {}) as Record<
      string,
      unknown
    >
    initSections(
      mainSections as Record<string, SectionData>,
      artifact.generation_status,
      artifact.generation_error
    )
    if (Array.isArray(custom_sections)) {
      custom_sections.forEach((cs: { id: string; title: string; content: string }) => {
        useEditorStore.getState().addCustomSection()
        const added =
          useEditorStore.getState().customSections[
            useEditorStore.getState().customSections.length - 1
          ]
        useEditorStore.getState().updateCustomSection(added.id, 'title', cs.title)
        useEditorStore.getState().updateCustomSection(added.id, 'content', cs.content)
      })
    }
  }, [artifact.id])

  useGenerationPoller(artifact.id, artifact.generation_status)

  const handleSave = async () => {
    setIsSaving(true)
    await fetch(`/api/artifacts/${artifact.id}/save`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections, custom_sections: customSections }),
    })
    setIsSaving(false)
    setIsDirty(false)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    const res = await fetch(`/api/artifacts/${artifact.id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sections,
        custom_sections: customSections,
        researcher_name: artifact.researchers?.full_name ?? 'researcher',
      }),
    })
    const data = await res.json()
    setIsPublishing(false)
    if (data.slug) router.push(`/p/${data.slug}`)
  }

  const handleRegenerateSection = async (sectionName: string) => {
    const res = await fetch('/api/generate/section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifact_id: artifact.id, section_name: sectionName }),
    })
    const data = await res.json()
    if (data.section) updateSection(sectionName, data.section)
  }

  const handleRegenerateAll = async () => {
    await fetch('/api/generate/full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artifact_id: artifact.id,
        researcher: artifact.researchers,
        artifact: {
          output_type: artifact.output_type,
          intake_data: artifact.intake_data,
        },
      }),
    })
    useEditorStore.getState().setGenerationStatus('generating')
  }

  const researcher = artifact.researchers

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex-shrink-0 border-b border-neutral-800 px-6 py-3
                      flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/admin"
            className="text-neutral-600 hover:text-neutral-300 transition-colors
                       text-sm flex items-center gap-1 shrink-0"
          >
            ← Dashboard
          </Link>
          <div className="w-px h-4 bg-neutral-800 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {researcher?.full_name ?? artifact.researcher_email}
            </p>
            <p className="text-xs text-neutral-500 capitalize mt-0.5">
              {artifact.output_type.replace(/_/g, ' ')} · {artifact.status}
              {isDirty && (
                <span className="ml-2 text-amber-500">· unsaved</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {artifact.slug && (
            <a
              href={`/p/${artifact.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              View published ↗
            </a>
          )}
        </div>
      </div>

      {/* Main editor area: resizable horizontally */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" autoSaveId="editor-panels">
          <Panel defaultSize={70} minSize={40}>
            <div className="h-full bg-neutral-950">
              <PagePreview outputType={artifact.output_type} />
            </div>
          </Panel>

          <PanelResizeHandle className="w-px bg-neutral-800 hover:bg-neutral-600
                                        data-[resize-handle-state=drag]:bg-neutral-500
                                        transition-colors" />

          <Panel defaultSize={30} minSize={20} maxSize={45}>
            <div className="h-full bg-neutral-900 flex flex-col">
              <SectionPanel
                artifactId={artifact.id}
                outputType={artifact.output_type}
                onRegenerateSection={handleRegenerateSection}
                onRegenerateAll={handleRegenerateAll}
                onSave={handleSave}
                onPublish={handlePublish}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Collapsible bottom bar */}
      <div className="flex-shrink-0 bg-neutral-950 border-t border-neutral-800">
        <button
          onClick={() => setBottomCollapsed((c) => !c)}
          className="w-full px-6 py-2.5 flex items-center justify-between
                     text-xs text-neutral-500 hover:text-neutral-300
                     hover:bg-neutral-900/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span
              className={`inline-block transition-transform ${
                bottomCollapsed ? '' : 'rotate-180'
              }`}
            >
              ▾
            </span>
            Additional Sections
            {customSections.length > 0 && (
              <span className="text-neutral-700">({customSections.length})</span>
            )}
          </span>
          <span className="text-neutral-700">
            {bottomCollapsed ? 'Click to expand' : 'Click to collapse'}
          </span>
        </button>
        {!bottomCollapsed && <CustomSectionAdder />}
      </div>
    </div>
  )
}