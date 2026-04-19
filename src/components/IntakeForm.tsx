'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CAREER_STAGES, PRIMARY_GOALS, TARGET_AUDIENCES, AI_COMFORT_OPTIONS
} from '@/lib/constants'
import type {
  OutputType, CareerStage, AiComfort, PrimaryGoal, TargetAudience
} from '@/lib/types'
import Link from 'next/link'

// ─── Field helpers ──────────────────────────────────────────────────────────

function Field({
  label, required, children, hint
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      {children}
    </div>
  )
}

const inputClass = `w-full bg-white border border-neutral-300 rounded-lg
  px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400
  focus:outline-none focus:border-neutral-500 transition-colors`

const textareaClass = `${inputClass} resize-none`

const selectClass = `${inputClass} cursor-pointer`

// ─── Step 1: Researcher Identity ────────────────────────────────────────────

interface IdentityFields {
  email: string
  full_name: string
  institution: string
  department_or_lab: string
  role_career_stage: CareerStage | ''
  field_and_subfield: string
  plain_language_research_description: string
  ai_comfort: AiComfort | ''
  additional_notes: string
}

function StepIdentity({
  values, onChange, onNext, lookupLoading, lookupError
}: {
  values: IdentityFields
  onChange: (k: keyof IdentityFields, v: string) => void
  onNext: () => void
  lookupLoading: boolean
  lookupError: string | null
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof IdentityFields, string>>>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!values.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(values.email)) e.email = 'Invalid email'
    if (!values.full_name.trim()) e.full_name = 'Full name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="space-y-5">
      <Field label="Email" required>
        <input
          type="email"
          className={inputClass}
          placeholder="researcher@university.edu"
          value={values.email}
          onChange={e => onChange('email', e.target.value)}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        {lookupLoading && (
          <p className="text-xs text-neutral-500 mt-1">Looking up existing record…</p>
        )}
        {lookupError && (
          <div className="text-xs text-amber-700 mt-1 space-y-1">
            <p>{lookupError}</p>
            <Link
              href={`/admin/intake/${encodeURIComponent(values.email)}`}
              className="text-neutral-500 hover:text-neutral-900 underline
                        underline-offset-2 transition-colors block"
            >
              Go to existing researcher record →
            </Link>
          </div>
        )}
      </Field>

      <Field label="Full name" required>
        <input
          className={inputClass}
          placeholder="Dr. Jane Smith"
          value={values.full_name}
          onChange={e => onChange('full_name', e.target.value)}
        />
        {errors.full_name && (
          <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Institution">
          <input
            className={inputClass}
            placeholder="Brown University"
            value={values.institution}
            onChange={e => onChange('institution', e.target.value)}
          />
        </Field>
        <Field label="Department / Lab">
          <input
            className={inputClass}
            placeholder="Dept. of Neuroscience"
            value={values.department_or_lab}
            onChange={e => onChange('department_or_lab', e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Career stage">
          <select
            className={selectClass}
            value={values.role_career_stage}
            onChange={e => onChange('role_career_stage', e.target.value)}
          >
            <option value="">Select…</option>
            {CAREER_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="AI-assisted generation comfort">
          <select
            className={selectClass}
            value={values.ai_comfort}
            onChange={e => onChange('ai_comfort', e.target.value)}
          >
            <option value="">Select…</option>
            {AI_COMFORT_OPTIONS.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Field and subfield"
        hint="e.g. Neuroscience — synaptic plasticity">
        <input
          className={inputClass}
          placeholder="Neuroscience — synaptic plasticity"
          value={values.field_and_subfield}
          onChange={e => onChange('field_and_subfield', e.target.value)}
        />
      </Field>

      <Field label="Plain-language research description" required
        hint="What the researcher does, in their words, for a general audience.">
        <textarea
          className={textareaClass}
          rows={4}
          placeholder="We study how the brain adapts to stress…"
          value={values.plain_language_research_description}
          onChange={e => onChange('plain_language_research_description', e.target.value)}
        />
      </Field>

      <Field label="Additional notes"
        hint="Anything internal that doesn't fit the form.">
        <textarea
          className={textareaClass}
          rows={2}
          value={values.additional_notes}
          onChange={e => onChange('additional_notes', e.target.value)}
        />
      </Field>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => validate() && onNext()}
          className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg
                     text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Output Type ─────────────────────────────────────────────────────

const OUTPUT_OPTIONS: { value: OutputType; label: string; description: string }[] = [
  {
    value: 'project_page',
    label: 'Project Page',
    description: 'One specific active project. Asks-first, current stage, what is needed.'
  },
  {
    value: 'researcher_profile',
    label: 'Researcher Profile',
    description: 'Person-level page. Research identity, themes, expertise, selected work.'
  },
  {
    value: 'lab_profile',
    label: 'Lab Profile',
    description: 'Team/lab-level page. Mission, directions, open opportunities, what the lab offers.'
  }
]

function StepOutputType({
  value, onChange, onNext, onBack
}: {
  value: OutputType | ''
  onChange: (v: OutputType) => void
  onNext: () => void
  onBack: () => void
}) {
  const [error, setError] = useState('')

  return (
    <div className="space-y-5">
      <p className="text-sm text-neutral-500">
        Choose the output type. This determines which fields appear next and
        how Claude generates the final page.
      </p>

      <div className="space-y-3">
        {OUTPUT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3.5 rounded-lg border transition-colors ${
              value === opt.value
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
            }`}
          >
            <p className="text-sm font-medium">{opt.label}</p>
            <p className={`text-xs mt-0.5 ${value === opt.value ? 'text-neutral-300' : 'text-neutral-500'}`}>
              {opt.description}
            </p>
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 border border-neutral-300 text-neutral-600
                     rounded-lg text-sm hover:border-neutral-500 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => {
            if (!value) { setError('Select an output type'); return }
            setError('')
            onNext()
          }}
          className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg
                     text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Output-specific fields ─────────────────────────────────────────

// Project Page fields
function ProjectPageFields({
  values, onChange, onAudienceToggle
}: {
  values: Record<string, unknown>
  onChange: (k: string, v: unknown) => void
  onAudienceToggle: (a: TargetAudience) => void
}) {
  const audiences = (values.target_audience as TargetAudience[]) ?? []

  return (
    <div className="space-y-5">
      <Field label="Project title" required>
        <input
          className={inputClass}
          placeholder="e.g. Synaptic Repair After Traumatic Brain Injury"
          value={(values.project_title as string) ?? ''}
          onChange={e => onChange('project_title', e.target.value)}
        />
      </Field>

      <Field label="Active project description" required
        hint="What is this specific project about? What stage is it at?">
        <textarea
          className={textareaClass}
          rows={5}
          value={(values.active_project_description as string) ?? ''}
          onChange={e => onChange('active_project_description', e.target.value)}
        />
      </Field>

      <Field label="Primary goal">
        <select
          className={selectClass}
          value={(values.primary_goal as string) ?? ''}
          onChange={e => onChange('primary_goal', e.target.value)}
        >
          <option value="">Select…</option>
          {PRIMARY_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </Field>

      <Field label="Target audience"
        hint="Select all that apply.">
        <div className="flex flex-wrap gap-2 mt-1">
          {TARGET_AUDIENCES.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => onAudienceToggle(a)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                audiences.includes(a)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Specific needs / asks"
        hint="What does the researcher need from this project page?">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.specific_needs_asks as string) ?? ''}
          onChange={e => onChange('specific_needs_asks', e.target.value)}
        />
      </Field>

      <Field label="What you offer"
        hint="What can collaborators / students / partners gain?">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.what_you_offer as string) ?? ''}
          onChange={e => onChange('what_you_offer', e.target.value)}
        />
      </Field>

      <Field label="Anything that should NOT be shared publicly">
        <input
          className={inputClass}
          placeholder="Unpublished data, pending patents…"
          value={(values.anything_not_public as string) ?? ''}
          onChange={e => onChange('anything_not_public', e.target.value)}
        />
      </Field>
    </div>
  )
}

// Researcher Profile fields
function ResearcherProfileFields({
  values, onChange
}: {
  values: Record<string, unknown>
  onChange: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-5">
      <Field label="Current focus"
        hint="What are they most actively working on right now?">
        <textarea
          className={textareaClass}
          rows={4}
          value={(values.current_focus as string) ?? ''}
          onChange={e => onChange('current_focus', e.target.value)}
        />
      </Field>

      <Field label="Who you want to reach"
        hint="Collaborators, students, industry, funders — be specific.">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.who_you_want_to_reach as string) ?? ''}
          onChange={e => onChange('who_you_want_to_reach', e.target.value)}
        />
      </Field>

      <Field label="What you offer"
        hint="Mentorship, methods, data, collaboration value.">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.what_you_offer as string) ?? ''}
          onChange={e => onChange('what_you_offer', e.target.value)}
        />
      </Field>

      <Field label="Anything that should NOT be shared publicly">
        <input
          className={inputClass}
          value={(values.anything_not_public as string) ?? ''}
          onChange={e => onChange('anything_not_public', e.target.value)}
        />
      </Field>
    </div>
  )
}

// Lab Profile fields
function LabProfileFields({
  values, onChange
}: {
  values: Record<string, unknown>
  onChange: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-5">
      <Field label="Lab name" required>
        <input
          className={inputClass}
          placeholder="e.g. Smith Lab for Neural Repair"
          value={(values.lab_name as string) ?? ''}
          onChange={e => onChange('lab_name', e.target.value)}
        />
      </Field>

      <p className="text-xs text-neutral-500 pt-1">
        If the PI is different from the person who submitted the intake form, fill in below.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="PI full name">
          <input
            className={inputClass}
            placeholder="Dr. Jane Smith"
            value={(values.pi_name as string) ?? ''}
            onChange={e => onChange('pi_name', e.target.value)}
          />
        </Field>
        <Field label="PI email">
          <input
            type="email"
            className={inputClass}
            placeholder="pi@university.edu"
            value={(values.pi_email as string) ?? ''}
            onChange={e => onChange('pi_email', e.target.value)}
          />
        </Field>
      </div>

      <Field label="PI career stage">
        <select
          className={selectClass}
          value={(values.pi_career_stage as string) ?? ''}
          onChange={e => onChange('pi_career_stage', e.target.value)}
        >
          <option value="">Select…</option>
          {CAREER_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Lab mission">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.lab_mission as string) ?? ''}
          onChange={e => onChange('lab_mission', e.target.value)}
        />
      </Field>

      <Field label="Current directions"
        hint="Main active research areas right now.">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.current_directions as string) ?? ''}
          onChange={e => onChange('current_directions', e.target.value)}
        />
      </Field>

      <Field label="Who belongs here"
        hint="What kind of students, postdocs, or collaborators fit this lab?">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.who_belongs_here as string) ?? ''}
          onChange={e => onChange('who_belongs_here', e.target.value)}
        />
      </Field>

      <Field label="Open opportunities">
        <textarea
          className={textareaClass}
          rows={2}
          placeholder="1 postdoc position, 2 grad student rotations open…"
          value={(values.open_opportunities as string) ?? ''}
          onChange={e => onChange('open_opportunities', e.target.value)}
        />
      </Field>

      <Field label="What the lab offers"
        hint="Training, mentorship, methods, infrastructure.">
        <textarea
          className={textareaClass}
          rows={3}
          value={(values.what_the_lab_offers as string) ?? ''}
          onChange={e => onChange('what_the_lab_offers', e.target.value)}
        />
      </Field>

      <Field label="Anything that should NOT be shared publicly">
        <input
          className={inputClass}
          value={(values.anything_not_public as string) ?? ''}
          onChange={e => onChange('anything_not_public', e.target.value)}
        />
      </Field>
    </div>
  )
}

// ─── File Upload Component ───────────────────────────────────────────────────

function FileUploadField({
  email,
  onUploadComplete,
}: {
  email: string
  onUploadComplete: (paths: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    Array.from(files).forEach(f => formData.append('files', f))
    formData.append('email', email)

    const res = await fetch('/api/intake/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      setError('Upload failed. Try again.')
      setUploading(false)
      return
    }

    const { paths } = await res.json()
    const next = [...uploaded, ...paths]
    setUploaded(next)
    onUploadComplete(next)
    setUploading(false)
  }

  return (
    <Field
      label="Supporting materials"
      hint="Upload posters, PDFs, figures. These will be read by Claude for context."
    >
      <input
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFiles}
        className="text-sm text-neutral-500 file:mr-3 file:py-1.5 file:px-3
                   file:rounded file:border file:border-neutral-300
                   file:bg-neutral-50 file:text-neutral-700 file:text-xs
                   file:cursor-pointer file:transition-colors
                   hover:file:border-neutral-400"
      />
      {uploading && (
        <p className="text-xs text-neutral-500 mt-1">Uploading…</p>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {uploaded.length > 0 && (
        <ul className="mt-2 space-y-1">
          {uploaded.map(p => (
            <li key={p} className="text-xs text-green-600">✓ {p.split('/').pop()}</li>
          ))}
        </ul>
      )}
    </Field>
  )
}

// ─── Main IntakeForm Component ───────────────────────────────────────────────

const defaultIdentity = {
  email: '', full_name: '', institution: '', department_or_lab: '',
  role_career_stage: '' as CareerStage | '',
  field_and_subfield: '', plain_language_research_description: '',
  ai_comfort: '' as AiComfort | '', additional_notes: ''
}

export function IntakeForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [identity, setIdentity] = useState(defaultIdentity)
  const [outputType, setOutputType] = useState<OutputType | ''>('')
  const [outputFields, setOutputFields] = useState<Record<string, unknown>>({
    target_audience: [] as TargetAudience[]
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  // Pre-fill identity fields if email already in DB
  const handleEmailBlur = async () => {
    if (!identity.email || !/\S+@\S+\.\S+/.test(identity.email)) return
    setLookupLoading(true)
    setLookupError(null)
    try {
      const res = await fetch(`/api/intake/lookup?email=${encodeURIComponent(identity.email)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.researcher) {
          const r = data.researcher
          setIdentity(prev => ({
            ...prev,
            full_name: r.full_name ?? prev.full_name,
            institution: r.institution ?? prev.institution,
            department_or_lab: r.department_or_lab ?? prev.department_or_lab,
            role_career_stage: r.role_career_stage ?? prev.role_career_stage,
            field_and_subfield: r.field_and_subfield ?? prev.field_and_subfield,
            plain_language_research_description:
              r.plain_language_research_description ?? prev.plain_language_research_description,
            ai_comfort: r.ai_comfort ?? prev.ai_comfort,
            additional_notes: r.additional_notes ?? prev.additional_notes,
          }))
          setLookupError('Existing researcher found — fields pre-filled. Review before submitting.')
        }
      }
    } catch {}
    setLookupLoading(false)
  }

  const updateIdentity = (k: keyof typeof defaultIdentity, v: string) =>
    setIdentity(prev => ({ ...prev, [k]: v }))

  const updateOutputField = (k: string, v: unknown) =>
    setOutputFields(prev => ({ ...prev, [k]: v }))

  const toggleAudience = (a: TargetAudience) => {
    const current = (outputFields.target_audience as TargetAudience[]) ?? []
    const next = current.includes(a)
      ? current.filter(x => x !== a)
      : [...current, a]
    updateOutputField('target_audience', next)
  }

  // Validate step 3 required fields by output type
  const validateStep3 = (): string | null => {
    if (outputType === 'project_page') {
      if (!outputFields.project_title) return 'Project title is required for a project page.'
      if (!outputFields.active_project_description)
        return 'Project description is required for a project page.'
    }
    if (outputType === 'lab_profile') {
      if (!outputFields.lab_name) return 'Lab name is required for a lab profile.'
    }
    return null
  }

  const handleSubmit = async () => {
    const validationError = validateStep3()
    if (validationError) { setSubmitError(validationError); return }

    setSubmitting(true)
    setSubmitError('')

    const payload = {
      researcher: {
        email: identity.email,
        full_name: identity.full_name,
        institution: identity.institution,
        department_or_lab: identity.department_or_lab,
        role_career_stage: identity.role_career_stage || null,
        field_and_subfield: identity.field_and_subfield,
        plain_language_research_description: identity.plain_language_research_description,
        ai_comfort: identity.ai_comfort || null,
        additional_notes: identity.additional_notes,
      },
      artifact: {
        output_type: outputType,
        intake_data: outputFields,
      }
    }

    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      setSubmitError(data.error ?? 'Submission failed. Try again.')
      setSubmitting(false)
      return
    }

    // Redirect to draft editor
    router.push(`/admin/artifacts/${data.artifact_id}/edit`)
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        {[
          { n: 1, label: 'Researcher' },
          { n: 2, label: 'Output type' },
          { n: 3, label: 'Details' }
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
              font-medium transition-colors ${
                step === n
                  ? 'bg-neutral-900 text-white'
                  : step > n
                    ? 'bg-neutral-400 text-white'
                    : 'bg-neutral-100 text-neutral-400'
              }`}>
              {n}
            </div>
            <span className={`text-xs ${step === n ? 'text-neutral-900' : 'text-neutral-400'}`}>
              {label}
            </span>
            {n < 3 && <span className="text-neutral-300 text-xs ml-1">→</span>}
          </div>
        ))}
      </div>

      {/* Steps */}
      {step === 1 && (
        <StepIdentity
          values={identity}
          onChange={updateIdentity}
          onNext={() => setStep(2)}
          lookupLoading={lookupLoading}
          lookupError={lookupError}
        />
      )}

      {step === 2 && (
        <StepOutputType
          value={outputType}
          onChange={setOutputType}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <div className="space-y-5">
          {outputType === 'project_page' && (
            <ProjectPageFields
              values={outputFields}
              onChange={updateOutputField}
              onAudienceToggle={toggleAudience}
            />
          )}
          {outputType === 'researcher_profile' && (
            <ResearcherProfileFields
              values={outputFields}
              onChange={updateOutputField}
            />
          )}
          {outputType === 'lab_profile' && (
            <LabProfileFields
              values={outputFields}
              onChange={updateOutputField}
            />
          )}

          {/* File upload — shared across all output types */}
          <div className="pt-2 border-t border-neutral-200">
            <FileUploadField
              email={identity.email}
              onUploadComplete={paths => updateOutputField('file_uploads', paths)}
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200
                          rounded-lg px-4 py-2">
              {submitError}
            </p>
          )}

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 border border-neutral-300 text-neutral-600
                         rounded-lg text-sm hover:border-neutral-500 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg
                         text-sm font-medium hover:bg-neutral-800 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Generating…' : 'Submit and Generate'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
