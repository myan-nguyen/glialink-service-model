'use client'
import { useEditorStore, SectionData } from './useEditorStore'
import { useShallow } from 'zustand/react/shallow'
import { PublicPage } from '@/components/public/PublicPage'
import type { Artifact } from '@/lib/types'

export function PagePreview({ outputType }: { outputType: string }) {
  const sections = useEditorStore(useShallow((state) => state.sections))
  const customSections = useEditorStore((state) => state.customSections)
  const selectedSection = useEditorStore((state) => state.selectedSection)
  const selectSection = useEditorStore((state) => state.selectSection)
  const generationStatus = useEditorStore((state) => state.generationStatus)

  if (generationStatus === 'pending' || generationStatus === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4
                      bg-white">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-brand
                        rounded-full animate-spin" />
        <p className="text-sm text-ink-muted font-serif">Generating content…</p>
        <p className="text-xs text-ink-subtle font-serif">About 30 seconds</p>
      </div>
    )
  }

  if (generationStatus === 'failed') {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center space-y-2 max-w-sm px-4">
          <p className="text-red-500 text-sm font-medium font-serif">
            Generation failed
          </p>
          <p className="text-ink-muted text-xs font-serif">
            Use "Regenerate all" to retry.
          </p>
        </div>
      </div>
    )
  }

  const fakeArtifact = {
    output_type: outputType as Artifact['output_type'],
    sections: {
      ...Object.fromEntries(
        Object.entries(sections).map(([k, v]) => [
          k,
          { content: (v as SectionData).content },
        ])
      ),
      ...(customSections.length > 0
        ? { custom_sections: customSections }
        : {}),
    },
  } as unknown as Artifact

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const sectionEl = target.closest('[data-section-key]')
    if (sectionEl) {
      const key = sectionEl.getAttribute('data-section-key')
      if (key) selectSection(selectedSection === key ? null : key)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-white font-serif text-ink animate-fade-in">
      <div onClick={handleClick}>
        <div
          className="section-clickable"
          data-selected={selectedSection ?? ''}
        >
          <PublicPage artifact={fakeArtifact} />
        </div>
        <style jsx global>{`
          [data-section-key='${selectedSection ?? '__none__'}'] {
            box-shadow: inset 0 0 0 2px rgba(124, 58, 237, 0.4) !important;
            border-radius: 8px;
          }
        `}</style>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-8">
        <PreviewFooterNotice />
      </div>
    </div>
  )
}

function PreviewFooterNotice() {
  return (
    <div className="text-xs text-ink-subtle font-serif text-center py-6
                    border-t border-surface-border">
      Preview — CTA and share banner hidden. They appear on the published page.
    </div>
  )
}