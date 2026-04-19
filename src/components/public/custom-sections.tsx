export function CustomSections({
  sections,
  cardStyle = false,
}: {
  sections: Array<{ id: string; title: string; content: string }>
  cardStyle?: boolean
}) {
  if (!sections?.length) return null

  if (cardStyle) {
    return (
      <>
        {sections.map((cs) => (
          <section
            key={cs.id}
            className="bg-canvas-soft border border-canvas-border rounded-2xl
                       p-6 sm:p-8"
          >
            {cs.title && (
              <p className="text-[11px] font-sans font-semibold tracking-[0.18em]
                            uppercase text-brand mb-4">
                {cs.title}
              </p>
            )}
            <p className="text-base leading-[1.7] text-ink-light whitespace-pre-wrap
                          max-w-[680px]">
              {cs.content}
            </p>
          </section>
        ))}
      </>
    )
  }

  return (
    <>
      {sections.map((cs) => (
        <section
          key={cs.id}
          className="py-10 sm:py-12 border-b border-canvas-border"
        >
          {cs.title && (
            <p className="text-[11px] font-sans font-semibold tracking-[0.18em]
                          uppercase text-brand mb-4">
              {cs.title}
            </p>
          )}
          <p className="text-base leading-[1.7] text-ink-light whitespace-pre-wrap
                        max-w-[680px]">
            {cs.content}
          </p>
        </section>
      ))}
    </>
  )
}