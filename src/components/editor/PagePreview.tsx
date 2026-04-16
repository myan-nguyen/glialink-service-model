'use client'
import { useEditorStore } from './useEditorStore'
import { SECTION_LABELS } from '@/lib/constants'
import { SECTION_ORDER } from '@/lib/generation'

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === '') {
    return <span className="text-neutral-600 italic">Not filled</span>
  }
  if (typeof value === 'string') {
    return <span>{value}</span>
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-neutral-600 italic">Empty</span>
    if (typeof value[0] === 'string') {
      return (
        <ul className="list-disc list-inside space-y-0.5">
          {(value as string[]).map((item, i) => (
            <li key={i} className="text-neutral-300">{item}</li>
          ))}
        </ul>
      )
    }
    if (typeof value[0] === 'object') {
      return (
        <div className="space-y-2">
          {(value as Record<string, string>[]).map((item, i) => (
            <div key={i} className="pl-3 border-l border-neutral-700 space-y-0.5">
              {Object.entries(item).map(([k, v]) => (
                <p key={k} className="text-sm text-neutral-400">
                  <span className="text-neutral-500 text-xs">
                    {k.replace(/_/g, ' ')}:{' '}
                  </span>
                  {v}
                </p>
              ))}
            </div>
          ))}
        </div>
      )
    }
  }
  return <span>{String(value)}</span>
}

export function PagePreview({ outputType }: { outputType: string }) {
  const { sections, customSections, selectedSection, selectSection, generationStatus } =
    useEditorStore()

  if (generationStatus === 'pending' || generationStatus === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-8 h-8 border-2 border-neutral-600 border-t-white
                        rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Generating content…</p>
        <p className="text-xs text-neutral-600">This takes about 30 seconds</p>
      </div>
    )
  }

  if (generationStatus === 'failed') {
    return (
      <div className="flex items-center justify-center h-full">
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
  const orderedSections = sectionOrder.filter((key) => key in sections)

  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {orderedSections.map((name) => {
          const section = sections[name]
          if (!section) return null
          const isSelected = selectedSection === name

          return (
            <div
              key={name}
              onClick={() => selectSection(isSelected ? null : name)}
              className={`rounded-xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-white/30 bg-neutral-800/60'
                  : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  {SECTION_LABELS[name] ?? name}
                </h3>
                {isSelected && (
                  <span className="text-xs text-neutral-500">Editing →</span>
                )}
              </div>
              <div className="space-y-2">
                {Object.entries(section.content).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-neutral-600 mb-0.5">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <div className="text-sm text-neutral-200 leading-relaxed">
                      {renderValue(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Custom sections in preview */}
        {customSections.map((cs) => (
          <div
            key={cs.id}
            className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5"
          >
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
              {cs.title || 'Custom Section'}
            </h3>
            <p className="text-sm text-neutral-200 whitespace-pre-wrap">
              {cs.content || <span className="text-neutral-600 italic">No content</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}