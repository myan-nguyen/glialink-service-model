'use client'
import { useState } from 'react'
import { useEditorStore } from './useEditorStore'
import { ContentFieldEditor } from './ContentFieldEditor'
import { SECTION_LABELS, CONFIDENCE_COLORS } from '@/lib/constants'
import { SECTION_ORDER } from '@/lib/generation'

interface Props {
  artifactId: string
  outputType: string
  onRegenerateSection: (sectionName: string) => Promise<void>
  onRegenerateAll: () => Promise<void>
  onSave: () => Promise<void>
  onPublish: () => Promise<void>
}

export function SectionPanel({
  artifactId,
  outputType,
  onRegenerateSection,
  onRegenerateAll,
  onSave,
  onPublish,
}: Props) {
  const {
    sections,
    selectedSection,
    selectSection,
    updateSectionContent,
    isDirty,
    isSaving,
    isPublishing,
  } = useEditorStore()

  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null)
  const [evidenceOpen, setEvidenceOpen] = useState(false)

  const sectionOrder = SECTION_ORDER[outputType] ?? Object.keys(sections)
  const orderedSections = sectionOrder.filter((key) => key in sections)

  const handleRegenSection = async (name: string) => {
    setRegeneratingSection(name)
    await onRegenerateSection(name)
    setRegeneratingSection(null)
  }

  const selected = selectedSection ? sections[selectedSection] : null

  return (
    <div className="flex flex-col h-full">
      {/* Section list */}
      <div className="flex-shrink-0 border-b border-neutral-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Sections
          </span>
        </div>
        <div className="overflow-y-auto max-h-48">
          {orderedSections.map((name) => {
            const section = sections[name]
            const label = SECTION_LABELS[name] ?? name
            const conf = section?.confidence ?? 'low'
            return (
              <button
                key={name}
                onClick={() => selectSection(selectedSection === name ? null : name)}
                className={`w-full text-left px-4 py-2.5 flex items-center
                            justify-between transition-colors text-sm ${
                  selectedSection === name
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded border ${CONFIDENCE_COLORS[conf]}`}
                >
                  {conf}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected section editor */}
      <div className="flex-1 overflow-y-auto">
        {selected && selectedSection ? (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">
                {SECTION_LABELS[selectedSection] ?? selectedSection}
              </h3>
              <button
                onClick={() => handleRegenSection(selectedSection)}
                disabled={regeneratingSection === selectedSection}
                className="text-xs px-2.5 py-1 border border-neutral-700
                           text-neutral-400 rounded hover:border-neutral-500
                           hover:text-white transition-colors disabled:opacity-40"
              >
                {regeneratingSection === selectedSection
                  ? 'Regenerating…'
                  : '↺ Regen section'}
              </button>
            </div>

            {/* Follow-up warning */}
            {selected.follow_up_needed && (
              <div className="text-xs text-amber-400 bg-amber-950/30 border
                              border-amber-800 rounded-lg px-3 py-2">
                <span className="font-medium">Follow-up needed: </span>
                {selected.follow_up_needed}
              </div>
            )}

            {/* Evidence (collapsible) */}
            <div>
              <button
                onClick={() => setEvidenceOpen((o) => !o)}
                className="text-xs text-neutral-600 hover:text-neutral-400
                           transition-colors"
              >
                {evidenceOpen ? '▾' : '▸'} Evidence
              </button>
              {evidenceOpen && (
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                  {selected.evidence}
                </p>
              )}
            </div>

            {/* Content fields */}
            <div className="space-y-4">
              {Object.entries(selected.content).map(([key, value]) => (
                <ContentFieldEditor
                  key={key}
                  fieldKey={key}
                  value={value}
                  onChange={(field, val) =>
                    updateSectionContent(selectedSection, field, val)
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 text-xs text-neutral-600 text-center">
            Select a section to edit
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 border-t border-neutral-800 px-4 py-4 space-y-2">
        <button
          onClick={onRegenerateAll}
          className="w-full py-2 text-sm border border-neutral-700 text-neutral-400
                     rounded-lg hover:border-neutral-500 hover:text-white transition-colors"
        >
          ↺ Regenerate all
        </button>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className="flex-1 py-2 text-sm border border-neutral-700 text-neutral-300
                       rounded-lg hover:border-neutral-500 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving…' : isDirty ? 'Save' : 'Saved'}
          </button>
          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="flex-1 py-2 text-sm bg-white text-neutral-900 rounded-lg
                       font-medium hover:bg-neutral-100 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPublishing ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}