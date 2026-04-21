'use client'
import { useRef, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { useEditorStore } from './useEditorStore'
import { ContentFieldEditor } from './ContentFieldEditor'
import { SECTION_LABELS, CONFIDENCE_COLORS, SECTION_ORDER } from '@/lib/constants'
import { useShallow } from 'zustand/react/shallow'

const inputClass = `w-full bg-white border border-neutral-300 rounded-lg
  px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400
  focus:outline-none focus:border-neutral-500 transition-colors`

interface Props {
  outputType: string
  onRegenerateSection: (sectionName: string) => Promise<void>
  onRegenerateAll: () => Promise<void>
  onSave: () => Promise<void>
  onPublish: () => Promise<void>
}

export function SectionPanel({
  outputType,
  onRegenerateSection,
  onRegenerateAll,
  onSave,
  onPublish,
}: Props) {
  const {
    selectedSection,
    selectSection,
    updateSectionContent,
    isDirty,
    isSaving,
    isPublishing,
    customSections,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    sectionSuggestions,
    dismissedSuggestions,
    dismissSuggestion,
  } = useEditorStore()

  const sections = useEditorStore(useShallow((state) => state.sections))

  const sectionListRef = useRef<ImperativePanelHandle>(null)
  const [listCollapsed, setListCollapsed] = useState(false)
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(true)

  const sectionOrder = SECTION_ORDER[outputType] ?? Object.keys(sections)
  const orderedSections = sectionOrder.filter((key) => key in sections)

  const handleRegenSection = async (name: string) => {
    setRegeneratingSection(name)
    await onRegenerateSection(name)
    setRegeneratingSection(null)
  }

  const selected = selectedSection ? sections[selectedSection] : null

  const toggleList = () => {
    if (listCollapsed) {
      sectionListRef.current?.expand()
    } else {
      sectionListRef.current?.collapse()
    }
  }

  const handleAddCustomSection = () => {
    addCustomSection()
    setCustomOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Vertically resizable: section list (top) + editor (bottom) */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Sticky header — always visible regardless of collapse state */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0
                        border-b border-neutral-200 bg-white">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Section Generation Confidence
          </span>
          <button
            onClick={toggleList}
            className="text-neutral-400 hover:text-neutral-600 transition-colors
                       text-[10px] px-1.5 py-0.5 rounded border border-neutral-200
                       hover:border-neutral-400"
          >
            {listCollapsed ? '▸ expand' : '▾ collapse'}
          </button>
        </div>

        {/* PanelGroup only manages the list items + editor, not the header */}
        <div className="flex-1 overflow-hidden">
        <PanelGroup direction="vertical" autoSaveId="section-panel-split">

          {/* Section list items — collapsible to 0; header above stays visible */}
          <Panel
            ref={sectionListRef}
            defaultSize={38}
            minSize={5}
            collapsible
            collapsedSize={0}
            onCollapse={() => setListCollapsed(true)}
            onExpand={() => setListCollapsed(false)}
          >
            <div className="h-full overflow-y-auto">
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
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border
                                      ${CONFIDENCE_COLORS[conf]}`}>
                      {conf}
                    </span>
                  </button>
                )
              })}
            </div>
          </Panel>

          <PanelResizeHandle
            className="h-1 bg-neutral-200 hover:bg-neutral-400
                       data-[resize-handle-state=drag]:bg-neutral-500
                       transition-colors cursor-row-resize"
          />

          {/* Selected section editor — fills remaining space */}
          <Panel defaultSize={62} minSize={20}>
            <div className="h-full overflow-y-auto">
              {selected && selectedSection ? (
                <div className="px-4 py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-neutral-900">
                      {SECTION_LABELS[selectedSection] ?? selectedSection}
                    </h3>
                    <button
                      onClick={() => handleRegenSection(selectedSection)}
                      disabled={regeneratingSection === selectedSection}
                      className="text-xs px-2.5 py-1 border border-neutral-300
                                 text-neutral-500 rounded hover:border-neutral-500
                                 hover:text-neutral-900 transition-colors disabled:opacity-40"
                    >
                      {regeneratingSection === selectedSection
                        ? 'Regenerating…'
                        : '↺ Regen section'}
                    </button>
                  </div>

                  {selected.follow_up_needed && (
                    <div className="text-xs text-amber-700 bg-amber-50 border
                                    border-amber-200 rounded-lg px-3 py-2">
                      <span className="font-medium">Follow-up needed: </span>
                      {selected.follow_up_needed}
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setEvidenceOpen((o) => !o)}
                      className="text-xs text-neutral-400 hover:text-neutral-600
                                 transition-colors"
                    >
                      {evidenceOpen ? '▾' : '▸'} Evidence
                    </button>
                    {evidenceOpen && (
                      <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                        {selected.evidence}
                      </p>
                    )}
                  </div>

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
                    {/* Lab link lives in discoverability but is edited from the header */}
                    {selectedSection === 'header' && outputType === 'researcher_profile' && (
                      <ContentFieldEditor
                        fieldKey="lab_link"
                        value={sections.discoverability?.content?.lab_link ?? ''}
                        onChange={(_field, val) =>
                          updateSectionContent('discoverability', 'lab_link', val)
                        }
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-6 text-xs text-neutral-400 text-center">
                  Select a section to edit
                </div>
              )}
            </div>
          </Panel>

        </PanelGroup>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex-shrink-0 border-t border-neutral-200">

        {/* Suggested sections */}
        {(() => {
          const visible = sectionSuggestions.filter(
            (s) => !dismissedSuggestions.includes(s.section_key)
          )
          if (visible.length === 0) return null
          return (
            <div className="border-b border-neutral-200 px-4 py-3 space-y-2">
              <button
                onClick={() => setSuggestionsOpen((o) => !o)}
                className="w-full flex items-center justify-between text-[11px]
                           text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <span>💡 Suggested additions ({visible.length})</span>
                <span>{suggestionsOpen ? '▾' : '▸'}</span>
              </button>
              {suggestionsOpen && (
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {visible.map((s) => (
                    <div
                      key={s.section_key}
                      className="border border-neutral-200 rounded-lg p-2.5 space-y-1.5 bg-neutral-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-neutral-700">{s.label}</p>
                        <button
                          onClick={() => dismissSuggestion(s.section_key)}
                          className="text-neutral-300 hover:text-neutral-500 transition-colors shrink-0 text-sm leading-none"
                          aria-label="Dismiss"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">{s.reason}</p>
                      {s.content_hint && (
                        <p className="text-[11px] text-neutral-600 leading-relaxed border-l-2 border-neutral-200 pl-2">
                          {s.content_hint}
                        </p>
                      )}
                      <button
                        onClick={() => {
                          addCustomSection(s.label, s.content_hint ?? '')
                          dismissSuggestion(s.section_key)
                          setCustomOpen(true)
                        }}
                        className="text-[11px] border border-neutral-300 text-neutral-500 rounded
                                   px-2.5 py-1 hover:border-neutral-500 hover:text-neutral-700
                                   transition-colors"
                      >
                        + Add as custom section
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Custom sections — shown when open or when any exist */}
        {(customOpen || customSections.length > 0) && (
          <div className="border-b border-neutral-200">
            <button
              onClick={() => setCustomOpen((o) => !o)}
              className="w-full px-4 py-2 flex items-center justify-between
                         text-xs text-neutral-500 hover:text-neutral-900
                         hover:bg-neutral-50 transition-colors"
            >
              <span>
                Additional Sections
                {customSections.length > 0 && (
                  <span className="ml-1 text-neutral-400">({customSections.length})</span>
                )}
              </span>
              <span>{customOpen ? '▾' : '▸'}</span>
            </button>

            {customOpen && (
              <div className="px-4 pb-3 max-h-48 overflow-y-auto space-y-3">
                {customSections.map((cs) => (
                  <div
                    key={cs.id}
                    className="border border-neutral-200 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        className={`${inputClass} flex-1`}
                        placeholder="Section title"
                        value={cs.title}
                        onChange={(e) =>
                          updateCustomSection(cs.id, 'title', e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeCustomSection(cs.id)}
                        className="text-xs text-neutral-400 hover:text-red-500
                                   transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      className={`${inputClass} resize-none`}
                      rows={3}
                      placeholder="Section content"
                      value={cs.content}
                      onChange={(e) =>
                        updateCustomSection(cs.id, 'content', e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-3 space-y-2">
          <button
            onClick={handleAddCustomSection}
            className="w-full py-2 text-sm border border-neutral-300 text-neutral-500
                       rounded-lg hover:border-neutral-500 hover:text-neutral-900
                       transition-colors"
          >
            + Add custom section
          </button>
          <button
            onClick={onRegenerateAll}
            className="w-full py-2 text-sm border border-neutral-300 text-neutral-500
                       rounded-lg hover:border-neutral-500 hover:text-neutral-900
                       transition-colors"
          >
            ↺ Regenerate all
          </button>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              disabled={!isDirty || isSaving}
              className="flex-1 py-2 text-sm border border-neutral-300 text-neutral-600
                         rounded-lg hover:border-neutral-500 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving…' : isDirty ? 'Save' : 'Saved'}
            </button>
            <button
              onClick={onPublish}
              disabled={isPublishing}
              className="flex-1 py-2 text-sm bg-neutral-900 text-white rounded-lg
                         font-medium hover:bg-neutral-800 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
