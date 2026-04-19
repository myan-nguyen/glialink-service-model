'use client'
import { useShallow } from 'zustand/react/shallow'
import { useEditorStore } from './useEditorStore'
import { SECTION_LABELS } from '@/lib/constants'
import { SECTION_ORDER } from '@/lib/constants'
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
      <div className="flex flex-col items-center justify-center h-full
                      space-y-4 bg-neutral-950">
        <div className="w-8 h-8 border-2 border-neutral-600 border-t-white
                        rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Generating content…</p>
        <p className="text-xs text-neutral-600">This takes about 30 seconds</p>
      </div>
    )
  }

  if (generationStatus === 'failed') {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-950">
        <div className="text-center space-y-2 max-w-sm px-4">
          <p className="text-red-400 text-sm font-medium">Generation failed</p>
          <p className="text-neutral-500 text-xs">
            Use "Regenerate all" in the right panel to retry.
          </p>
        </div>
      </div>
    )
  }

  const sectionOrder = SECTION_ORDER[outputType] ?? Object.keys(sections)

  // Build a synthetic artifact for the PublicPage renderer
  const artifact = {
    output_type: outputType,
    sections: {
      ...sections,
      custom_sections: customSections,
    },
  } as unknown as Artifact

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      {/* Preview frame */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
        <PublicPage artifact={artifact} />

        {/* Section selection overlay */}
        <EditorSectionOverlay
          sectionOrder={sectionOrder}
          sections={sections}
          selectedSection={selectedSection}
          onSelect={selectSection}
        />
      </div>

      {/* Subtle preview banner at top */}
      <div className="fixed top-[52px] right-5 z-10">
        <span className="px-3 py-1 text-[10px] font-sans font-semibold
                         tracking-wider uppercase text-brand bg-brand-mist
                         border border-brand-soft/40 rounded-full">
          Preview
        </span>
      </div>
    </div>
  )
}

// Invisible overlay that makes each section clickable without altering the
// visual layout. Wraps the public renderer with positioned click targets.
function EditorSectionOverlay({
  sectionOrder,
  sections,
  selectedSection,
  onSelect,
}: {
  sectionOrder: string[]
  sections: Record<string, unknown>
  selectedSection: string | null
  onSelect: (name: string | null) => void
}) {
  // No-op for now: selection ring is applied via a global CSS rule
  // that targets data-section-name attributes if we later add them.
  // The PublicPage renderer does not currently expose per-section refs.
  // Selection is driven by the right-panel section list; clicking in the
  // preview to select is a future enhancement.
  return null
}