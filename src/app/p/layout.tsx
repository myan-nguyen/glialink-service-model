export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-canvas font-serif text-ink antialiased">
      {children}
    </div>
  )
}