'use client'
import { useEditorStore } from './useEditorStore'

const inputClass = `bg-neutral-900 border border-neutral-700 rounded-lg
  px-3 py-2 text-sm text-white placeholder-neutral-600
  focus:outline-none focus:border-neutral-500 transition-colors`

export function CustomSectionAdder() {
  const { customSections, addCustomSection, updateCustomSection, removeCustomSection } =
    useEditorStore()

  return (
    <div className="border-t border-neutral-800 px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-white">Additional Sections</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Add custom sections like patents, press, or awards.
            </p>
          </div>
          <button
            onClick={addCustomSection}
            className="px-3 py-1.5 text-xs border border-neutral-700 text-neutral-400
                       rounded-lg hover:border-neutral-500 hover:text-white transition-colors"
          >
            + Add section
          </button>
        </div>

        {customSections.length > 0 && (
          <div className="space-y-4">
            {customSections.map((cs) => (
              <div
                key={cs.id}
                className="border border-neutral-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <input
                    className={`${inputClass} flex-1 mr-3`}
                    placeholder="Section title"
                    value={cs.title}
                    onChange={(e) => updateCustomSection(cs.id, 'title', e.target.value)}
                  />
                  <button
                    onClick={() => removeCustomSection(cs.id)}
                    className="text-xs text-neutral-600 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  className={`${inputClass} w-full resize-none`}
                  rows={3}
                  placeholder="Section content"
                  value={cs.content}
                  onChange={(e) => updateCustomSection(cs.id, 'content', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}