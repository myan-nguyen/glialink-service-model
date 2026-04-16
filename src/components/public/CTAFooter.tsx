const CTA_EMAIL = process.env.NEXT_PUBLIC_CTA_EMAIL ?? 'myan_nguyen@brown.edu'

export function CTAFooter({ ctaText }: { ctaText?: string }) {
  const subject = encodeURIComponent('Glialink — Research Collaboration Inquiry')

  return (
    <div className="border-t border-parchment-border mt-4">
      {/* CTA section */}
      <div className="py-14 text-center">
        <p className="font-display text-2xl text-ink mb-3">
          {ctaText || 'Interested in connecting?'}
        </p>
        <p className="text-sm text-ink-muted font-serif mb-6 max-w-sm mx-auto">
          Reach out to the Glialink team and we will connect you with this researcher.
        </p>
        <a
          href={`mailto:${CTA_EMAIL}?subject=${subject}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-parchment
                     font-serif text-sm rounded-full hover:bg-ink-light
                     transition-colors"
        >
          Get in touch
          <span className="text-gold">→</span>
        </a>
      </div>

      {/* Glialink footer */}
      <div className="border-t border-parchment-border py-6 text-center">
        <p className="text-xs text-ink-subtle font-serif">
          Powered by{' '}
          <span className="font-display font-semibold text-ink-muted">Glialink</span>
          {' '}— making research discoverable, communicable, and impactful.
        </p>
      </div>
    </div>
  )
}