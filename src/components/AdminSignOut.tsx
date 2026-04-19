'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AdminSignOut({ compact = false }: { compact?: boolean }) {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (compact) {
    return (
      <button
        onClick={handleSignOut}
        title="Sign out"
        className="w-full h-7 flex items-center justify-center rounded
                   text-neutral-600 hover:text-neutral-400 hover:bg-neutral-800
                   transition-colors"
      >
        ⏻
      </button>
    )
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
    >
      Sign out
    </button>
  )
}