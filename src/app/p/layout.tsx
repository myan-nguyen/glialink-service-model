export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white font-serif text-ink antialiased">
      {children}
    </div>
  )
}