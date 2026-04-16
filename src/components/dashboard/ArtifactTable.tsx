'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ArtifactRow } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function OutputTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    project_page: 'Project',
    researcher_profile: 'Researcher',
    lab_profile: 'Lab',
  }
  const colors: Record<string, string> = {
    project_page: 'bg-blue-950/40 text-blue-400 border-blue-800',
    researcher_profile: 'bg-violet-950/40 text-violet-400 border-violet-800',
    lab_profile: 'bg-emerald-950/40 text-emerald-400 border-emerald-800',
  }
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border font-medium ${
        colors[type] ?? 'bg-neutral-800 text-neutral-400 border-neutral-700'
      }`}
    >
      {labels[type] ?? type}
    </span>
  )
}

function GenerationBadge({ status }: { status: string }) {
  if (status === 'complete') return null
  const colors: Record<string, string> = {
    pending: 'text-neutral-500',
    generating: 'text-amber-400',
    failed: 'text-red-400',
  }
  const labels: Record<string, string> = {
    pending: 'Pending',
    generating: 'Generating…',
    failed: 'Failed',
  }
  return (
    <span className={`text-xs ${colors[status] ?? 'text-neutral-500'}`}>
      {labels[status] ?? status}
    </span>
  )
}

interface Props {
  artifacts: ArtifactRow[]
  onDelete: (id: string) => void
  deleting: string | null
}

export function ArtifactTable({ artifacts, onDelete, deleting }: Props) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (artifacts.length === 0) {
    return (
      <p className="text-sm text-neutral-600 py-6 text-center">
        None yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left py-2.5 px-3 text-xs font-medium
                           text-neutral-500 uppercase tracking-wide">
              Researcher
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium
                           text-neutral-500 uppercase tracking-wide">
              Type
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium
                           text-neutral-500 uppercase tracking-wide hidden md:table-cell">
              Institution
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium
                           text-neutral-500 uppercase tracking-wide hidden lg:table-cell">
              Updated
            </th>
            <th className="py-2.5 px-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {artifacts.map((a) => {
            const name = a.researchers?.full_name ?? a.researchers?.email ?? '—'
            const email = a.researchers?.email ?? ''
            const institution = a.researchers?.institution ?? '—'

            return (
              <tr
                key={a.id}
                onClick={() => {
                  const email = a.researchers?.email
                  if (email) {
                    router.push(`/admin/intake/${encodeURIComponent(email)}`)
                  } else {
                    router.push(`/admin/artifacts/${a.id}/edit`)
                  }
                }}
                className="hover:bg-neutral-800/30 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-3">
                  <p className="font-medium text-white group-hover:text-white">
                    {name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{email}</p>
                  <div className="mt-1">
                    <GenerationBadge status={a.generation_status} />
                  </div>
                </td>
                <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                        <OutputTypeBadge type={a.output_type} />
                        {a.slug && (
                        <a
                            href={`/p/${a.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-neutral-600 hover:text-neutral-400
                                    transition-colors"
                        >
                            ↗
                        </a>
                        )}
                    </div>
                </td>
                <td className="py-3 px-3 text-neutral-400 hidden md:table-cell">
                  {institution}
                </td>
                <td className="py-3 px-3 text-neutral-500 hidden lg:table-cell">
                  {formatDate(a.updated_at)}
                </td>
                <td
                  className="py-3 px-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {confirmDelete === a.id ? (
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-neutral-500">Sure?</span>
                      <button
                        onClick={() => {
                          onDelete(a.id)
                          setConfirmDelete(null)
                        }}
                        disabled={deleting === a.id}
                        className="text-xs text-red-400 hover:text-red-300
                                   transition-colors disabled:opacity-40"
                      >
                        {deleting === a.id ? 'Deleting…' : 'Yes, delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs text-neutral-600 hover:text-neutral-400
                                   transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(a.id)}
                      className="text-xs text-neutral-700 hover:text-red-400
                                 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}