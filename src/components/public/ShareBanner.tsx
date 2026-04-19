'use client'
import { useState } from 'react'

export function ShareBanner({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-b border-canvas-border bg-canvas-soft">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center
                      justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-ink-muted font-sans shrink-0">
            Share this page
          </span>
          <span className="text-xs text-ink-subtle font-mono truncate
                           hidden sm:block">
            {url}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 text-xs font-sans border
                     border-canvas-border bg-canvas text-ink-muted
                     rounded-full hover:border-brand hover:text-brand
                     transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}