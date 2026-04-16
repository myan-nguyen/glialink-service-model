import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="font-display text-5xl font-bold text-ink-subtle">404</p>
        <h1 className="font-display text-xl text-ink">Page not found</h1>
        <p className="text-sm text-ink-muted font-serif">
          This page may not exist, or has not been published yet.
        </p>
        <p className="text-xs text-ink-subtle font-serif pt-2">
          Powered by{' '}
          <span className="font-display font-semibold text-ink-muted">Glialink</span>
        </p>
      </div>
    </div>
  )
}