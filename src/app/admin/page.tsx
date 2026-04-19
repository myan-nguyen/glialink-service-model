'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArtifactTable } from '@/components/dashboard/ArtifactTable'
import type { ArtifactRow } from '@/lib/types'

export default function AdminDashboard() {
  const [artifacts, setArtifacts] = useState<ArtifactRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchArtifacts = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/artifacts')
    const data = await res.json()
    if (data.error) setError(data.error)
    else setArtifacts(data.artifacts)
    setLoading(false)
  }

  useEffect(() => {
    fetchArtifacts()
  }, [])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const res = await fetch(`/api/admin/artifacts/${id}`, { method: 'DELETE' })
    if (res.ok) setArtifacts((prev) => prev.filter((a) => a.id !== id))
    setDeleting(null)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return artifacts
    const q = search.toLowerCase()
    return artifacts.filter((a) => {
      const r = a.researchers
      return (
        r?.full_name?.toLowerCase().includes(q) ||
        r?.email?.toLowerCase().includes(q) ||
        r?.institution?.toLowerCase().includes(q) ||
        r?.department_or_lab?.toLowerCase().includes(q)
      )
    })
  }, [artifacts, search])

  const drafts = filtered.filter((a) => a.status === 'draft')
  const published = filtered.filter((a) => a.status === 'published')

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {artifacts.length} artifact{artifacts.length !== 1 ? 's' : ''}
              {' · '}
              {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
              {' · '}
              {published.length} published
            </p>
          </div>
          <Link
            href="/admin/intake/new"
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg
                       text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            + New Intake
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="search"
            placeholder="Search by name, email, or institution…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-white border border-neutral-300
                       rounded-lg px-4 py-2.5 text-sm text-neutral-900
                       placeholder-neutral-400 focus:outline-none
                       focus:border-neutral-500 transition-colors"
          />
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border
                          border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
                <div className="h-12 bg-neutral-100 rounded animate-pulse" />
                <div className="h-12 bg-neutral-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-medium text-neutral-700">Drafts</h2>
                <span className="text-xs text-neutral-500 bg-neutral-100
                                 px-2 py-0.5 rounded-full">
                  {drafts.length}
                </span>
              </div>
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <ArtifactTable
                  artifacts={drafts}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-medium text-neutral-700">Published</h2>
                <span className="text-xs text-neutral-500 bg-neutral-100
                                 px-2 py-0.5 rounded-full">
                  {published.length}
                </span>
              </div>
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <ArtifactTable
                  artifacts={published}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
