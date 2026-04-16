'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AdminSignOut() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="mt-1 text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
    >
      Sign out
    </button>
  )
}