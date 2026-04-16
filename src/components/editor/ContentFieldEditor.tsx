'use client'
import { SHORT_TEXT_FIELDS } from '@/lib/constants'

const inputClass = `w-full bg-neutral-800 border border-neutral-700 rounded-md
  px-3 py-2 text-sm text-white placeholder-neutral-600
  focus:outline-none focus:border-neutral-500 transition-colors`

const textareaClass = `${inputClass} resize-none`

interface Props {
  fieldKey: string
  value: unknown
  onChange: (field: string, value: unknown) => void
}

export function ContentFieldEditor({ fieldKey, value, onChange }: Props) {
  const label = fieldKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  // String field
  if (typeof value === 'string' || value === null) {
    const isShort = SHORT_TEXT_FIELDS.has(fieldKey)
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-400">{label}</label>
        {isShort ? (
          <input
            className={inputClass}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(fieldKey, e.target.value)}
          />
        ) : (
          <textarea
            className={textareaClass}
            rows={3}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(fieldKey, e.target.value)}
          />
        )}
      </div>
    )
  }

  // String array field
  if (Array.isArray(value) && (value.length === 0 || typeof value[0] === 'string')) {
    const arr = value as string[]
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-400">{label}</label>
        <div className="space-y-1.5">
          {arr.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                value={item}
                onChange={(e) => {
                  const next = [...arr]
                  next[i] = e.target.value
                  onChange(fieldKey, next)
                }}
              />
              <button
                onClick={() => onChange(fieldKey, arr.filter((_, j) => j !== i))}
                className="px-2 text-neutral-600 hover:text-red-400 transition-colors
                           text-lg leading-none shrink-0"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange(fieldKey, [...arr, ''])}
            className="text-xs text-neutral-500 hover:text-neutral-300
                       transition-colors mt-1"
          >
            + Add item
          </button>
        </div>
      </div>
    )
  }

  // Object array field (e.g. findings objects, figure objects, project objects)
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
    const arr = value as Record<string, string>[]
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-400">{label}</label>
        <div className="space-y-3">
          {arr.map((item, i) => (
            <div
              key={i}
              className="border border-neutral-700 rounded-lg p-3 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Item {i + 1}</span>
                <button
                  onClick={() => onChange(fieldKey, arr.filter((_, j) => j !== i))}
                  className="text-xs text-neutral-600 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
              {Object.entries(item).map(([k, v]) => (
                <div key={k} className="space-y-1">
                  <label className="block text-xs text-neutral-500">
                    {k.replace(/_/g, ' ')}
                  </label>
                  <input
                    className={inputClass}
                    value={v ?? ''}
                    onChange={(e) => {
                      const next = arr.map((obj, j) =>
                        j === i ? { ...obj, [k]: e.target.value } : obj
                      )
                      onChange(fieldKey, next)
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={() => {
              const template = arr[0]
                ? Object.fromEntries(Object.keys(arr[0]).map((k) => [k, '']))
                : { value: '' }
              onChange(fieldKey, [...arr, template])
            }}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            + Add item
          </button>
        </div>
      </div>
    )
  }

  // Fallback for booleans or unknown types
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-neutral-400">{label}</label>
      <input
        className={inputClass}
        value={String(value ?? '')}
        onChange={(e) => onChange(fieldKey, e.target.value)}
      />
    </div>
  )
}