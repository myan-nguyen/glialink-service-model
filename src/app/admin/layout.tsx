import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AdminNav } from '@/components/AdminNav'
import { AdminSignOut } from '@/components/AdminSignOut'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-neutral-800 flex flex-col">
        <div className="px-5 py-5 border-b border-neutral-800">
          <span className="text-sm font-semibold tracking-wide text-white">
            Glialink
          </span>
          <span className="ml-1.5 text-xs text-neutral-500">admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <AdminNav />
        </nav>
        <div className="px-5 py-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          <AdminSignOut />
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}