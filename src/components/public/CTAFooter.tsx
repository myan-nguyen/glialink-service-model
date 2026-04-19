const CTA_EMAIL = process.env.NEXT_PUBLIC_CTA_EMAIL ?? 'myan_nguyen@brown.edu'

export function CTAFooter({ ctaText }: { ctaText?: string }) {
  const subject = encodeURIComponent('Glialink — Research Collaboration Inquiry')

  return (
    <div className="mt-8 sm:mt-12">
      {/* CTA card */}
      <div className="bg-gradient-to-br from-brand-mist to-brand-ghost
                      border border-brand-soft/30 rounded-2xl
                      p-8 sm:p-10 text-center">
        <h3 className="font-display text-xl sm:text-2xl md:text-3xl
                       font-bold text-ink leading-tight mb-3
                       max-w-xl mx-auto">
          {ctaText ||
            'Is your research invisible to people who could help? Get the collaborators, students, and support you\'ve been missing.'}
        </h3>
        <p className="text-sm sm:text-base text-ink-muted font-sans mb-6
                      max-w-lg mx-auto">
          Glialink turns your paper, abstract, and link into a living page
          with clear asks and active context.
        </p>
        <a
          href={`mailto:${CTA_EMAIL}?subject=${subject}`}
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3
                     bg-brand hover:bg-brand-dark text-white font-sans
                     font-medium text-sm rounded-full
                     transition-colors shadow-sm hover:shadow-md"
        >
          Share your research
          <span>→</span>
        </a>
      </div>

      {/* Small footer */}
      <div className="py-6 text-center">
        <p className="text-xs text-ink-subtle font-sans">
          Powered by{' '}
          <span className="font-display font-semibold text-brand">
            Glialink
          </span>
          {' '}— making research discoverable, communicable, and impactful.
        </p>
      </div>
    </div>
  )
}