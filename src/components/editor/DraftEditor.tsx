'use client'
import { useEffect } from 'react'
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

  const isDirty = useEditorStore((state) => state.isDirty)
  useUnsavedWarning(isDirty)

  useEffect(() => {
    const { custom_sections, ...mainSections } = (artifact.sections ?? {}) as Record<
      string,
      unknown
    >
    // Reset all client-side state to avoid stale data from previous artifact
    useEditorStore.setState({ customSections: [], sectionSuggestions: [], dismissedSuggestions: [] })
    initSections(
      mainSections as Record<string, SectionData>,
      artifact.generation_status,
      artifact.generation_error
    )
    if (Array.isArray(custom_sections)) {
      custom_sections.forEach((cs: { id: string; title: string; content: string }) => {
        useEditorStore.getState().addCustomSection(cs.title, cs.content)
      })
    }
    // Load suggestions for already-complete artifacts (poller only fires for in-progress ones)
    if (artifact.generation_status === 'complete') {
      useEditorStore.getState().setSectionSuggestions(
        artifact.page_readiness?.section_suggestions ?? []
      )
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
      <div className="flex-shrink-0 border-b border-neutral-200 px-6 py-3
                      flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/admin"
            className="text-neutral-400 hover:text-neutral-600 transition-colors
                       text-sm flex items-center gap-1 shrink-0"
          >
            ← Dashboard
          </Link>
          <div className="w-px h-4 bg-neutral-200 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
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
              className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
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
            <div className="h-full bg-white">
              <PagePreview outputType={artifact.output_type} />
            </div>
          </Panel>

          <PanelResizeHandle className="w-px bg-neutral-200 hover:bg-neutral-400
                                        data-[resize-handle-state=drag]:bg-neutral-500
                                        transition-colors" />

          <Panel defaultSize={30} minSize={20} maxSize={45}>
            <div className="h-full bg-neutral-50 flex flex-col">
              <SectionPanel
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

    </div>
  )
}
