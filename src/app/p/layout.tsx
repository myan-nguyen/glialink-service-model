export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-parchment font-serif text-ink">
      {children}
    </div>
  )
}