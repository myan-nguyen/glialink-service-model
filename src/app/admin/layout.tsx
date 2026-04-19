import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex bg-white text-neutral-900">
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}