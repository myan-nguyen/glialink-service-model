'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore, SectionData } from './useEditorStore'
import { useGenerationPoller } from './useGenerationPoller'
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

  // Initialise store from server-fetched artifact
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
    // Restore custom sections if any were saved
    if (Array.isArray(custom_sections)) {
      custom_sections.forEach((cs: { id: string; title: string; content: string }) => {
        useEditorStore.getState().addCustomSection()
        // Overwrite the newly added empty custom section with saved data
        const added =
          useEditorStore.getState().customSections[
            useEditorStore.getState().customSections.length - 1
          ]
        useEditorStore
          .getState()
          .updateCustomSection(added.id, 'title', cs.title)
        useEditorStore
          .getState()
          .updateCustomSection(added.id, 'content', cs.content)
      })
    }
  }, [artifact.id])

  // Poll for generation completion if not already done
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

    if (data.slug) {
      router.push(`/p/${data.slug}`)
    }
  }

  const handleRegenerateSection = async (sectionName: string) => {
    const res = await fetch('/api/generate/section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifact_id: artifact.id, section_name: sectionName }),
    })
    const data = await res.json()
    if (data.section) {
      updateSection(sectionName, data.section)
    }
  }

  const handleRegenerateAll = async () => {
    // Re-trigger full generation via the full route
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
    // Poller will pick up the status change
    useEditorStore.getState().setGenerationStatus('generating')
  }

  const researcher = artifact.researchers

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-neutral-800 px-6 py-3
                      flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            {researcher?.full_name ?? artifact.researcher_email}
          </p>
          <p className="text-xs text-neutral-500 capitalize mt-0.5">
            {artifact.output_type.replace(/_/g, ' ')} · {artifact.status}
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Main editor layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Live preview */}
        <div className="flex-1 bg-neutral-950 border-r border-neutral-800">
          <PagePreview outputType={artifact.output_type} />
        </div>

        {/* Right: Section panel */}
        <div className="w-80 flex-shrink-0 bg-neutral-900 flex flex-col">
          <SectionPanel
            artifactId={artifact.id}
            outputType={artifact.output_type}
            onRegenerateSection={handleRegenerateSection}
            onRegenerateAll={handleRegenerateAll}
            onSave={handleSave}
            onPublish={handlePublish}
          />
        </div>
      </div>

      {/* Bottom: Custom section adder */}
      <div className="flex-shrink-0 bg-neutral-950 border-t border-neutral-800">
        <CustomSectionAdder />
      </div>
    </div>
  )
}