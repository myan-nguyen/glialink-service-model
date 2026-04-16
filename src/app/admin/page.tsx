import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <Link
          href="/admin/intake/new"
          className="px-4 py-2 bg-white text-neutral-900 rounded-lg
                     text-sm font-medium hover:bg-neutral-100 transition-colors"
        >
          + New Intake
        </Link>
      </div>
      <p className="text-neutral-500 text-sm">
        No artifacts yet. Create your first intake above.
      </p>
    </div>
  )
}