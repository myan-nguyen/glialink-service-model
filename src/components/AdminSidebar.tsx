'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminSignOut } from './AdminSignOut'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/intake/new', label: 'New Intake', icon: '＋' },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const path = usePathname()

  return (
    <aside
      className={`${
        collapsed ? 'w-14' : 'w-56'
      } shrink-0 border-r border-neutral-800 flex flex-col
         transition-[width] duration-200 ease-out`}
    >
      {/* Brand + collapse toggle */}
      <div className="px-3 py-4 border-b border-neutral-800 flex items-center
                      justify-between gap-2">
        {!collapsed && (
          <div className="truncate">
            <span className="text-sm font-semibold tracking-wide text-white">
              Glialink
            </span>
            <span className="ml-1.5 text-xs text-neutral-500">admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-7 h-7 flex items-center justify-center rounded
                     text-neutral-500 hover:text-white hover:bg-neutral-800
                     transition-colors shrink-0"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {links.map(({ href, label, icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-md text-sm
                          transition-colors ${
                collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'
              } ${
                active
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <span className="text-neutral-500 text-xs shrink-0">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-neutral-800">
        {!collapsed && (
          <p className="text-xs text-neutral-500 truncate mb-1">{userEmail}</p>
        )}
        <AdminSignOut compact={collapsed} />
      </div>
    </aside>
  )
}