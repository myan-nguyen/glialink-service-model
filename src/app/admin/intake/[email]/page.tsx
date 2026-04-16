import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { IntakeEditClient } from '@/components/IntakeEditClient'

export default async function IntakeEditPage({
  params,
}: {
  params: Promise<{ email: string }>
}) {
  const { email } = await params
  const decoded = decodeURIComponent(email)
  const supabase = await createClient()

  const { data: researcher, error: rError } = await supabase
    .from('researchers')
    .select('*')
    .eq('email', decoded)
    .is('deleted_at', null)
    .single()

  if (rError || !researcher) notFound()

  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('id, output_type, status, slug, generation_status, created_at, updated_at')
    .eq('researcher_email', decoded)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <IntakeEditClient
      researcher={researcher}
      artifacts={artifacts ?? []}
    />
  )
}