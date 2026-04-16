import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DraftEditor } from '@/components/editor/DraftEditor'

export default async function EditArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: artifact, error } = await supabase
    .from('artifacts')
    .select('*, researchers(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !artifact) notFound()

  return <DraftEditor artifact={artifact as any} />
}