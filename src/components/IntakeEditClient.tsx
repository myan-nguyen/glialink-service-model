'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CAREER_STAGES,
  PRIMARY_GOALS,
  TARGET_AUDIENCES,
  AI_COMFORT_OPTIONS,
} from '@/lib/constants'
import type {
  Researcher,
  OutputType,
  CareerStage,
  AiComfort,
  TargetAudience,
} from '@/lib/types'

// ─── Shared field primitives (same as IntakeForm) ────────────────────────────

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-neutral-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      {children}
    </div>
  )
}

const inputClass = `w-full bg-neutral-900 border border-neutral-700 rounded-lg
  px-3 py-2 text-sm text-white placeholder-neutral-600
  focus:outline-none focus:border-neutral-500 transition-colors`

const textareaClass = `${inputClass} resize-none`
const selectClass = `${inputClass} cursor-pointer`

// ─── Artifact list item ──────────────────────────────────────────────────────

function OutputTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    project_page: 'Project',
    researcher_profile: 'Researcher',
    lab_profile: 'Lab',
  }
  const colors: Record<string, string> = {
    project_page: 'bg-blue-950/40 text-blue-400 border-blue-800',
    researcher_profile: 'bg-violet-950/40 text-violet-400 border-violet-800',
    lab_profile: 'bg-emerald-950/40 text-emerald-400 border-emerald-800',
  }
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border font-medium ${
        colors[type] ?? 'bg-neutral-800 text-neutral-400 border-neutral-700'
      }`}
    >
      {labels[type] ?? type}
    </span>
  )
}

interface ArtifactMeta {
  id: string
  output_type: OutputType
  status: string
  slug: string | null
  generation_status: string
  created_at: string
  updated_at: string
}

function ArtifactListItem({ artifact }: { artifact: ArtifactMeta }) {
  const date = new Date(artifact.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex items-center justify-between py-3 border-b
                    border-neutral-800 last:border-0">
      <div className="flex items-center gap-3">
        <OutputTypeBadge type={artifact.output_type} />
        <div>
          <p className="text-xs text-neutral-400 capitalize">
            {artifact.status}
            {artifact.generation_status !== 'complete' && (
              <span className="ml-2 text-amber-400">
                · {artifact.generation_status}
              </span>
            )}
          </p>
          <p className="text-xs text-neutral-600 mt-0.5">Updated {date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {artifact.slug && (
          <a
            href={`/p/${artifact.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-600 hover:text-neutral-400
                       transition-colors"
          >
            View ↗
          </a>
        )}
        <Link
          href={`/admin/artifacts/${artifact.id}/edit`}
          className="text-xs text-neutral-400 hover:text-white
                     border border-neutral-700 rounded px-2.5 py-1
                     hover:border-neutral-500 transition-colors"
        >
          Edit
        </Link>
      </div>
    </div>
  )
}

// ─── Identity editor ─────────────────────────────────────────────────────────

function IdentityEditor({
  researcher,
  onSaved,
}: {
  researcher: Researcher
  onSaved: () => void
}) {
  const [values, setValues] = useState({
    full_name: researcher.full_name ?? '',
    institution: researcher.institution ?? '',
    department_or_lab: researcher.department_or_lab ?? '',
    role_career_stage: (researcher.role_career_stage ?? '') as CareerStage | '',
    field_and_subfield: researcher.field_and_subfield ?? '',
    plain_language_research_description:
      researcher.plain_language_research_description ?? '',
    ai_comfort: (researcher.ai_comfort ?? '') as AiComfort | '',
    additional_notes: researcher.additional_notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof values, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    if (!values.full_name.trim()) {
      setError('Full name is required')
      return
    }
    setSaving(true)
    setError('')
    const res = await fetch(
      `/api/admin/researchers/${encodeURIComponent(researcher.email)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }
    )
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onSaved()
    } else {
      const d = await res.json()
      setError(d.error ?? 'Save failed')
    }
  }

  return (
    <div className="space-y-5">
      <Field label="Full name" required>
        <input
          className={inputClass}
          value={values.full_name}
          onChange={(e) => set('full_name', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Institution">
          <input
            className={inputClass}
            value={values.institution}
            onChange={(e) => set('institution', e.target.value)}
          />
        </Field>
        <Field label="Department / Lab">
          <input
            className={inputClass}
            value={values.department_or_lab}
            onChange={(e) => set('department_or_lab', e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Career stage">
          <select
            className={selectClass}
            value={values.role_career_stage}
            onChange={(e) => set('role_career_stage', e.target.value)}
          >
            <option value="">Select…</option>
            {CAREER_STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="AI-assisted generation comfort">
          <select
            className={selectClass}
            value={values.ai_comfort}
            onChange={(e) => set('ai_comfort', e.target.value)}
          >
            <option value="">Select…</option>
            {AI_COMFORT_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Field and subfield">
        <input
          className={inputClass}
          value={values.field_and_subfield}
          onChange={(e) => set('field_and_subfield', e.target.value)}
        />
      </Field>

      <Field label="Plain-language research description">
        <textarea
          className={textareaClass}
          rows={4}
          value={values.plain_language_research_description}
          onChange={(e) => set('plain_language_research_description', e.target.value)}
        />
      </Field>

      <Field label="Additional notes">
        <textarea
          className={textareaClass}
          rows={2}
          value={values.additional_notes}
          onChange={(e) => set('additional_notes', e.target.value)}
        />
      </Field>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-white text-neutral-900 rounded-lg text-sm
                     font-medium hover:bg-neutral-100 transition-colors
                     disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

// ─── New artifact form (Steps 2–3 only) ─────────────────────────────────────

const OUTPUT_OPTIONS: { value: OutputType; label: string; description: string }[] = [
  {
    value: 'project_page',
    label: 'Project Page',
    description: 'One specific active project.',
  },
  {
    value: 'researcher_profile',
    label: 'Researcher Profile',
    description: 'Person-level page.',
  },
  {
    value: 'lab_profile',
    label: 'Lab Profile',
    description: 'Team/lab-level page.',
  },
]

function NewArtifactForm({
  researcher,
  existingArtifacts,
}: {
  researcher: Researcher
  existingArtifacts: ArtifactMeta[]
}) {
  const router = useRouter()
  const [step, setStep] = useState<2 | 3>(2)
  const [outputType, setOutputType] = useState<OutputType | ''>('')
  const [outputFields, setOutputFields] = useState<Record<string, unknown>>({
    target_audience: [] as TargetAudience[],
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [typeError, setTypeError] = useState('')

  const updateField = (k: string, v: unknown) =>
    setOutputFields((prev) => ({ ...prev, [k]: v }))

  const toggleAudience = (a: TargetAudience) => {
    const current = (outputFields.target_audience as TargetAudience[]) ?? []
    updateField(
      'target_audience',
      current.includes(a) ? current.filter((x) => x !== a) : [...current, a]
    )
  }

  // Check if a non-project_page type already exists and is not deleted
  const existingTypes = existingArtifacts.map((a) => a.output_type)
  const profileExists = existingTypes.includes('researcher_profile')
  const labExists = existingTypes.includes('lab_profile')

  const validateStep3 = (): string | null => {
    if (outputType === 'project_page' && !outputFields.project_title)
      return 'Project title is required'
    if (outputType === 'project_page' && !outputFields.active_project_description)
      return 'Project description is required'
    if (outputType === 'lab_profile' && !outputFields.lab_name)
      return 'Lab name is required'
    return null
  }

  const handleSubmit = async () => {
    const err = validateStep3()
    if (err) { setSubmitError(err); return }
    setSubmitting(true)
    setSubmitError('')

    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        researcher: {
          email: researcher.email,
          full_name: researcher.full_name,
          institution: researcher.institution,
          department_or_lab: researcher.department_or_lab,
          role_career_stage: researcher.role_career_stage,
          field_and_subfield: researcher.field_and_subfield,
          plain_language_research_description:
            researcher.plain_language_research_description,
          ai_comfort: researcher.ai_comfort,
          additional_notes: researcher.additional_notes,
        },
        artifact: {
          output_type: outputType,
          intake_data: outputFields,
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setSubmitError(data.error ?? 'Submission failed')
      setSubmitting(false)
      return
    }

    router.push(`/admin/artifacts/${data.artifact_id}/edit`)
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">
          Select the output type to generate under this researcher.
        </p>

        {OUTPUT_OPTIONS.map((opt) => {
          const isDisabled =
            (opt.value === 'researcher_profile' && profileExists) ||
            (opt.value === 'lab_profile' && labExists)

          return (
            <button
              key={opt.value}
              onClick={() => !isDisabled && setOutputType(opt.value)}
              disabled={isDisabled}
              className={`w-full text-left px-4 py-3.5 rounded-lg border
                          transition-colors ${
                isDisabled
                  ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : outputType === opt.value
                    ? 'border-white bg-neutral-800 text-white'
                    : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
              }`}
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isDisabled ? 'Already exists for this researcher' : opt.description}
              </p>
            </button>
          )
        })}

        {typeError && <p className="text-xs text-red-400">{typeError}</p>}

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              if (!outputType) { setTypeError('Select an output type'); return }
              setTypeError('')
              setStep(3)
            }}
            className="px-5 py-2.5 bg-white text-neutral-900 rounded-lg
                       text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    )
  }

  // Step 3 — output-specific fields
  // Reuse the same field components from IntakeForm by importing inline logic.
  // For brevity these are inlined here since they are identical to IntakeForm Step 3.

  return (
    <div className="space-y-5">
      {/* Project page fields */}
      {outputType === 'project_page' && (
        <>
          <Field label="Project title" required>
            <input
              className={inputClass}
              value={(outputFields.project_title as string) ?? ''}
              onChange={(e) => updateField('project_title', e.target.value)}
            />
          </Field>
          <Field label="Active project description" required>
            <textarea
              className={textareaClass}
              rows={5}
              value={(outputFields.active_project_description as string) ?? ''}
              onChange={(e) => updateField('active_project_description', e.target.value)}
            />
          </Field>
          <Field label="Primary goal">
            <select
              className={selectClass}
              value={(outputFields.primary_goal as string) ?? ''}
              onChange={(e) => updateField('primary_goal', e.target.value)}
            >
              <option value="">Select…</option>
              {PRIMARY_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Target audience" hint="Select all that apply.">
            <div className="flex flex-wrap gap-2 mt-1">
              {TARGET_AUDIENCES.map((a) => {
                const selected = (
                  (outputFields.target_audience as TargetAudience[]) ?? []
                ).includes(a)
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAudience(a)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selected
                        ? 'border-white bg-neutral-800 text-white'
                        : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    {a}
                  </button>
                )
              })}
            </div>
          </Field>
          <Field label="Specific needs / asks">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.specific_needs_asks as string) ?? ''}
              onChange={(e) => updateField('specific_needs_asks', e.target.value)}
            />
          </Field>
          <Field label="What you offer">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.what_you_offer as string) ?? ''}
              onChange={(e) => updateField('what_you_offer', e.target.value)}
            />
          </Field>
          <Field label="Anything that should NOT be shared publicly">
            <input
              className={inputClass}
              value={(outputFields.anything_not_public as string) ?? ''}
              onChange={(e) => updateField('anything_not_public', e.target.value)}
            />
          </Field>
        </>
      )}

      {/* Researcher profile fields */}
      {outputType === 'researcher_profile' && (
        <>
          <Field label="Current focus">
            <textarea
              className={textareaClass}
              rows={4}
              value={(outputFields.current_focus as string) ?? ''}
              onChange={(e) => updateField('current_focus', e.target.value)}
            />
          </Field>
          <Field label="Who you want to reach">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.who_you_want_to_reach as string) ?? ''}
              onChange={(e) => updateField('who_you_want_to_reach', e.target.value)}
            />
          </Field>
          <Field label="What you offer">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.what_you_offer as string) ?? ''}
              onChange={(e) => updateField('what_you_offer', e.target.value)}
            />
          </Field>
          <Field label="Anything that should NOT be shared publicly">
            <input
              className={inputClass}
              value={(outputFields.anything_not_public as string) ?? ''}
              onChange={(e) => updateField('anything_not_public', e.target.value)}
            />
          </Field>
        </>
      )}

      {/* Lab profile fields */}
      {outputType === 'lab_profile' && (
        <>
          <Field label="Lab name" required>
            <input
              className={inputClass}
              value={(outputFields.lab_name as string) ?? ''}
              onChange={(e) => updateField('lab_name', e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="PI full name">
              <input
                className={inputClass}
                value={(outputFields.pi_name as string) ?? ''}
                onChange={(e) => updateField('pi_name', e.target.value)}
              />
            </Field>
            <Field label="PI email">
              <input
                type="email"
                className={inputClass}
                value={(outputFields.pi_email as string) ?? ''}
                onChange={(e) => updateField('pi_email', e.target.value)}
              />
            </Field>
          </div>
          <Field label="PI career stage">
            <select
              className={selectClass}
              value={(outputFields.pi_career_stage as string) ?? ''}
              onChange={(e) => updateField('pi_career_stage', e.target.value)}
            >
              <option value="">Select…</option>
              {CAREER_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Lab mission">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.lab_mission as string) ?? ''}
              onChange={(e) => updateField('lab_mission', e.target.value)}
            />
          </Field>
          <Field label="Current directions">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.current_directions as string) ?? ''}
              onChange={(e) => updateField('current_directions', e.target.value)}
            />
          </Field>
          <Field label="Who belongs here">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.who_belongs_here as string) ?? ''}
              onChange={(e) => updateField('who_belongs_here', e.target.value)}
            />
          </Field>
          <Field label="Open opportunities">
            <textarea
              className={textareaClass}
              rows={2}
              value={(outputFields.open_opportunities as string) ?? ''}
              onChange={(e) => updateField('open_opportunities', e.target.value)}
            />
          </Field>
          <Field label="What the lab offers">
            <textarea
              className={textareaClass}
              rows={3}
              value={(outputFields.what_the_lab_offers as string) ?? ''}
              onChange={(e) => updateField('what_the_lab_offers', e.target.value)}
            />
          </Field>
          <Field label="Anything that should NOT be shared publicly">
            <input
              className={inputClass}
              value={(outputFields.anything_not_public as string) ?? ''}
              onChange={(e) => updateField('anything_not_public', e.target.value)}
            />
          </Field>
        </>
      )}

      {submitError && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-800
                      rounded-lg px-4 py-2">
          {submitError}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={() => setStep(2)}
          className="px-5 py-2.5 border border-neutral-700 text-neutral-300
                     rounded-lg text-sm hover:border-neutral-500 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2.5 bg-white text-neutral-900 rounded-lg text-sm
                     font-medium hover:bg-neutral-100 transition-colors
                     disabled:opacity-50"
        >
          {submitting ? 'Generating…' : 'Submit and Generate'}
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function IntakeEditClient({
  researcher,
  artifacts,
}: {
  researcher: Researcher
  artifacts: ArtifactMeta[]
}) {
  const [activePanel, setActivePanel] = useState<'identity' | 'new'>('identity')

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-neutral-600 hover:text-neutral-400
                      transition-colors flex items-center gap-1 mb-4"
          >
            ← Dashboard
          </Link>
          <h1 className="text-xl font-semibold text-white">
            {researcher.full_name ?? researcher.email}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">{researcher.email}</p>
          {researcher.institution && (
            <p className="text-sm text-neutral-600 mt-0.5">{researcher.institution}</p>
          )}
        </div>

        {/* Existing artifacts */}
        {artifacts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-neutral-300 mb-3">
              Existing outputs
            </h2>
            <div className="border border-neutral-800 rounded-xl px-4">
              {artifacts.map((a) => (
                <ArtifactListItem key={a.id} artifact={a} />
              ))}
            </div>
          </div>
        )}

        {/* Panel toggle */}
        <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800
                        rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActivePanel('identity')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              activePanel === 'identity'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Edit researcher info
          </button>
          <button
            onClick={() => setActivePanel('new')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              activePanel === 'new'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            + New output
          </button>
        </div>

        {/* Active panel */}
        <div className="border border-neutral-800 rounded-xl p-6">
          {activePanel === 'identity' ? (
            <>
              <h2 className="text-sm font-medium text-neutral-300 mb-5">
                Researcher identity
              </h2>
              <IdentityEditor
                researcher={researcher}
                onSaved={() => {}}
              />
            </>
          ) : (
            <>
              <h2 className="text-sm font-medium text-neutral-300 mb-5">
                New output
              </h2>
              <NewArtifactForm
                researcher={researcher}
                existingArtifacts={artifacts}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}