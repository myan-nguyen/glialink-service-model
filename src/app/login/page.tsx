'use client'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const supabase = createClient()
  const params = useSearchParams()
  const error = params.get('error')

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center space-y-6 max-w-sm w-full px-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Glialink Admin
          </h1>
          <p className="text-neutral-500 text-sm">Internal use only</p>
        </div>
        {error === 'unauthorized' && (
          <p className="text-red-400 text-sm bg-red-950/30 border border-red-800
                        rounded-lg px-4 py-2">
            This Google account is not authorized.
          </p>
        )}
        {error === 'auth_failed' && (
          <p className="text-red-400 text-sm bg-red-950/30 border border-red-800
                        rounded-lg px-4 py-2">
            Authentication failed. Try again.
          </p>
        )}
        <button
          onClick={handleLogin}
          className="w-full px-6 py-3 bg-white text-neutral-900 rounded-lg
                     font-medium text-sm hover:bg-neutral-100 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}