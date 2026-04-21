'use client'
import { useState } from 'react'
import Link from 'next/link'

export function ShareBanner({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://glialink-service-model.vercel.app/p/${slug}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-b border-surface-border bg-surface-tint">
      <div className="w-full px-4 sm:px-8 py-2.5 flex items-center
                      justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-ink-muted font-sans shrink-0 hidden sm:block">
            Share this page
          </span>
          <span className="text-ink-subtle hidden sm:block">·</span>
          <span className="text-xs text-ink-subtle font-mono truncate
                           hidden sm:block">
            {url}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 text-xs font-sans border
                     border-surface-border bg-white text-ink-muted
                     rounded-full hover:border-brand hover:text-brand
                     transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}