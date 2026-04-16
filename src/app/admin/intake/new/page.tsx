import { IntakeForm } from '@/components/IntakeForm'

export default function NewIntakePage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">New Intake</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Fill this out from the structured intake draft. Submission creates or
          updates the researcher record and triggers output generation.
        </p>
      </div>
      <IntakeForm />
    </div>
  )
}