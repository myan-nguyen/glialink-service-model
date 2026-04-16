'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/intake/new', label: 'New Intake' },
]

export function AdminNav() {
  const path = usePathname()

  return (
    <>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
            path === href
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
          }`}
        >
          {label}
        </Link>
      ))}
    </>
  )
}