import {
  SectionWrapper,
  SectionLabel,
  SectionHeading,
  Prose,
  TagList,
  BulletList,
  Pullquote,
  InlineMeta,
} from './primitives'

// Hero card — LinkedIn profile-style header with avatar placeholder
export function ResearcherHero({
  content,
}: {
  content: Record<string, string>
}) {
  const initials = (content.researcher_name || '')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="py-8 sm:py-12 animate-fade-up">
      <div className="bg-canvas-soft border border-canvas-border rounded-2xl
                      p-6 sm:p-8">
        {/* Top row: avatar + identity */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br
                          from-brand to-brand-deep flex items-center justify-center
                          shrink-0 shadow-sm">
            <span className="text-2xl sm:text-3xl font-display font-bold text-white">
              {initials || '◆'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl
                           font-bold text-ink leading-tight mb-2 tracking-tight">
              {content.researcher_name || 'Researcher'}
            </h1>
            {content.role_career_stage && (
              <p className="text-base text-ink-light mb-1">
                {content.role_career_stage}
              </p>
            )}
            <InlineMeta
              items={[content.institution, content.department_or_lab]}
            />
            {content.field_and_subfield && (
              <p className="mt-3 inline-block text-xs font-sans font-semibold
                            tracking-wide text-brand-deep bg-brand-mist
                            px-3 py-1 rounded-full">
                {content.field_and_subfield}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// LinkedIn-style stacked section card
function ProfileCard({
  label,
  title,
  children,
}: {
  label?: string
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-canvas-soft border border-canvas-border rounded-2xl
                        p-6 sm:p-8">
      {label && (
        <p className="text-[11px] font-sans font-semibold tracking-[0.18em]
                      uppercase text-brand mb-2">
          {label}
        </p>
      )}
      {title && (
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink
                       leading-tight mb-5">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

export function ResearcherIdentity({
  content,
}: {
  content: Record<string, string>
}) {
  const hasAny =
    content.mission_statement ||
    content.identity_statement ||
    content.plain_language_research_description
  if (!hasAny) return null
  return (
    <ProfileCard label="About">
      <div className="space-y-4 max-w-[680px]">
        {content.mission_statement && (
          <p className="font-display text-lg sm:text-xl text-ink
                        leading-snug italic">
            {content.mission_statement}
          </p>
        )}
        {content.identity_statement && (
          <Prose>{content.identity_statement}</Prose>
        )}
        {content.plain_language_research_description && (
          <Prose>{content.plain_language_research_description}</Prose>
        )}
      </div>
    </ProfileCard>
  )
}

export function ResearchThemes({
  content,
}: {
  content: { core_research_themes?: string[] }
}) {
  if (!content.core_research_themes?.length) return null
  return (
    <ProfileCard label="Research themes" title="Areas of focus">
      <TagList tags={content.core_research_themes} />
    </ProfileCard>
  )
}

export function CurrentFocusSection({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.current_focus_description) return null
  return (
    <ProfileCard label="Currently" title="What I'm working on now">
      <Prose className="max-w-[680px]">
        {content.current_focus_description}
      </Prose>
    </ProfileCard>
  )
}

export function ExpertiseSection({
  content,
}: {
  content: { methods_expertise?: string[]; domain_expertise?: string[] }
}) {
  const hasMethods = content.methods_expertise?.length
  const hasDomain = content.domain_expertise?.length
  if (!hasMethods && !hasDomain) return null

  return (
    <ProfileCard label="Expertise" title="Skills & knowledge">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasMethods && (
          <div>
            <p className="text-xs font-sans font-semibold tracking-wide
                          uppercase text-ink-muted mb-3">
              Methods
            </p>
            <BulletList items={content.methods_expertise!} />
          </div>
        )}
        {hasDomain && (
          <div>
            <p className="text-xs font-sans font-semibold tracking-wide
                          uppercase text-ink-muted mb-3">
              Domain
            </p>
            <BulletList items={content.domain_expertise!} />
          </div>
        )}
      </div>
    </ProfileCard>
  )
}

export function SelectedProjects({
  content,
}: {
  content: {
    projects?: Array<{
      project_title: string
      short_description: string
      current_status: string
    }>
  }
}) {
  if (!content.projects?.length) return null
  return (
    <ProfileCard label="Projects" title="Selected work">
      <div className="divide-y divide-canvas-border">
        {content.projects.map((p, i) => (
          <div key={i} className={`${i === 0 ? 'pb-5' : 'py-5'} ${i === content.projects!.length - 1 ? 'pb-0' : ''} space-y-1.5`}>
            <h3 className="font-display text-base font-semibold text-ink">
              {p.project_title}
            </h3>
            {p.short_description && (
              <p className="text-sm text-ink-light leading-relaxed">
                {p.short_description}
              </p>
            )}
            {p.current_status && (
              <p className="text-xs text-brand font-sans font-medium">
                {p.current_status}
              </p>
            )}
          </div>
        ))}
      </div>
    </ProfileCard>
  )
}

export function SelectedOutputs({
  content,
}: {
  content: {
    outputs?: Array<{ type: string; title: string; url?: string | null }>
  }
}) {
  if (!content.outputs?.length) return null
  return (
    <ProfileCard label="Publications & outputs" title="Recent work">
      <div className="divide-y divide-canvas-border">
        {content.outputs.map((o, i) => (
          <div
            key={i}
            className={`${i === 0 ? 'pb-4' : 'py-4'} ${i === content.outputs!.length - 1 ? 'pb-0' : ''} flex items-start gap-4`}
          >
            <span className="text-[10px] font-sans font-semibold tracking-wider
                             uppercase text-brand mt-1 w-16 shrink-0">
              {o.type}
            </span>
            {o.url ? (
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink hover:text-brand-deep
                           underline underline-offset-2 decoration-canvas-border
                           hover:decoration-brand transition-colors flex-1"
              >
                {o.title}
              </a>
            ) : (
              <p className="text-sm text-ink flex-1">{o.title}</p>
            )}
          </div>
        ))}
      </div>
    </ProfileCard>
  )
}

export function WhoTheyWantToReach({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.target_description) return null
  return (
    <ProfileCard label="Connections" title="Who I want to reach">
      <Prose className="max-w-[680px]">{content.target_description}</Prose>
    </ProfileCard>
  )
}

export function ResearcherAsks({
  content,
}: {
  content: Record<string, string>
}) {
  const hasAny = content.primary_needs || content.secondary_needs
  if (!hasAny) return null
  return (
    <ProfileCard label="Asks" title="What I'm looking for">
      <div className="space-y-4 max-w-[680px]">
        {content.primary_needs && (
          <div className="border-l-[3px] border-brand pl-4">
            <Prose>{content.primary_needs}</Prose>
          </div>
        )}
        {content.secondary_needs && (
          <Prose className="text-ink-muted">{content.secondary_needs}</Prose>
        )}
      </div>
    </ProfileCard>
  )
}

export function WhatTheyOffer({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.offer_description) return null
  return (
    <ProfileCard label="What I offer" title="How I can support others">
      <Prose className="max-w-[680px]">{content.offer_description}</Prose>
    </ProfileCard>
  )
}

export function HumanLayer({ content }: { content: Record<string, string> }) {
  const hasAny =
    content.researcher_perspective_quote ||
    content.working_style_or_values ||
    content.why_this_work_matters_to_them
  if (!hasAny) return null
  return (
    <ProfileCard label="In my own words">
      <div className="space-y-5 max-w-[680px]">
        {content.researcher_perspective_quote && (
          <Pullquote
            quote={content.researcher_perspective_quote}
            attribution={content.why_this_work_matters_to_them}
          />
        )}
        {content.working_style_or_values && (
          <p className="text-sm text-ink-muted font-sans italic">
            {content.working_style_or_values}
          </p>
        )}
      </div>
    </ProfileCard>
  )
}

export function Discoverability({
  content,
}: {
  content: {
    keywords_tags?: string[]
    website_links?: string[]
    publication_links?: string[]
    lab_link?: string | null
  }
}) {
  const hasAnyLinks =
    content.website_links?.length ||
    content.publication_links?.length ||
    content.lab_link
  const hasTags = content.keywords_tags?.length
  if (!hasAnyLinks && !hasTags) return null

  return (
    <ProfileCard label="Find me elsewhere" title="Links & keywords">
      {hasTags && (
        <div className="mb-5">
          <TagList tags={content.keywords_tags!} />
        </div>
      )}
      {hasAnyLinks && (
        <div className="space-y-1.5">
          {content.website_links?.map((url, i) => (
            <ExternalLink key={`w-${i}`} url={url} />
          ))}
          {content.publication_links?.map((url, i) => (
            <ExternalLink key={`p-${i}`} url={url} />
          ))}
          {content.lab_link && <ExternalLink url={content.lab_link} />}
        </div>
      )}
    </ProfileCard>
  )
}

function ExternalLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-sm text-brand hover:text-brand-deep
                 underline underline-offset-2 transition-colors break-all"
    >
      {url}
    </a>
  )
}