import React from 'react'

// ─── Shared primitives ───────────────────────────────────────────────────────

export function SectionWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`py-10 border-b border-parchment-border ${className}`}>
      {children}
    </section>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-display font-semibold tracking-[0.15em] uppercase
                  text-gold mb-4">
      {children}
    </p>
  )
}

export function Prose({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={`text-base leading-relaxed text-ink-light ${className}`}>
      {children}
    </p>
  )
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 text-xs font-serif bg-parchment-dark
                     border border-parchment-border text-ink-muted rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-base text-ink-light leading-relaxed">
          <span className="text-gold mt-1 shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Quote({ quote, context }: { quote: string; context?: string }) {
  if (!quote) return null
  return (
    <blockquote className="border-l-2 border-gold pl-6 py-1">
      <p className="font-display italic text-xl text-ink leading-snug">
        &ldquo;{quote}&rdquo;
      </p>
      {context && (
        <p className="mt-3 text-sm text-ink-muted font-serif">{context}</p>
      )}
    </blockquote>
  )
}

// ─── Project Page Sections ───────────────────────────────────────────────────

export function ProjectHeader({ content }: { content: Record<string, string> }) {
  return (
    <div className="py-14 border-b border-parchment-border">
      <div className="max-w-3xl">
        {content.project_type_label && (
          <p className="text-xs font-display font-semibold tracking-[0.15em]
                        uppercase text-gold mb-5">
            {content.project_type_label}
          </p>
        )}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink
                       leading-tight mb-6">
          {content.project_title || 'Untitled Project'}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm
                        text-ink-muted font-serif">
          {content.researcher_name && (
            <span className="font-semibold text-ink-light">
              {content.researcher_name}
            </span>
          )}
          {content.researcher_role && <span>{content.researcher_role}</span>}
          {content.institution && <span>{content.institution}</span>}
          {content.department_or_lab && <span>{content.department_or_lab}</span>}
        </div>
      </div>
    </div>
  )
}

export function ProjectSummary({ content }: { content: Record<string, string> }) {
  if (!content.one_sentence_summary) return null
  return (
    <SectionWrapper>
      <p className="font-display text-2xl text-ink leading-snug max-w-2xl">
        {content.one_sentence_summary}
      </p>
    </SectionWrapper>
  )
}

export function WhyThisMatters({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper>
      <SectionLabel>Why This Matters</SectionLabel>
      <div className="space-y-3 max-w-2xl">
        {content.relevance && <Prose>{content.relevance}</Prose>}
        {content.urgency && <Prose>{content.urgency}</Prose>}
        {content.context && <Prose>{content.context}</Prose>}
      </div>
    </SectionWrapper>
  )
}

export function ResearchFocus({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper>
      <SectionLabel>Research Focus</SectionLabel>
      <div className="max-w-2xl space-y-4">
        {content.research_question && (
          <p className="font-display text-xl text-ink italic leading-snug">
            {content.research_question}
          </p>
        )}
        {content.project_description && (
          <Prose>{content.project_description}</Prose>
        )}
      </div>
    </SectionWrapper>
  )
}

export function MethodsApproach({ content }: { content: Record<string, string> }) {
  if (!content.methods_approach) return null
  return (
    <SectionWrapper>
      <SectionLabel>Methods & Approach</SectionLabel>
      <Prose className="max-w-2xl">{content.methods_approach}</Prose>
    </SectionWrapper>
  )
}

export function KeyFindings({ content }: { content: { findings?: string[] } }) {
  if (!content.findings?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Key Findings</SectionLabel>
      <div className="max-w-2xl">
        <BulletList items={content.findings} />
      </div>
    </SectionWrapper>
  )
}

export function CurrentStage({ content }: { content: Record<string, string> }) {
  if (!content.current_stage) return null
  return (
    <div className="py-6 border-b border-parchment-border">
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-parchment-dark
                      border border-parchment-border rounded-full">
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
        <span className="text-sm font-serif text-ink-muted">
          {content.current_stage}
        </span>
      </div>
    </div>
  )
}

export function ResearchTags({ content }: { content: { tags?: string[] } }) {
  if (!content.tags?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Research Tags</SectionLabel>
      <TagList tags={content.tags} />
    </SectionWrapper>
  )
}

export function ProjectAsks({
  content,
}: {
  content: Record<string, string>
}) {
  return (
    <SectionWrapper className="bg-parchment-dark -mx-6 px-6 rounded-xl">
      <SectionLabel>What We Need</SectionLabel>
      <div className="max-w-2xl space-y-3">
        {content.ask_title && (
          <h3 className="font-display text-xl font-semibold text-ink">
            {content.ask_title}
          </h3>
        )}
        {content.ask_description && <Prose>{content.ask_description}</Prose>}
        {content.best_fit_people && (
          <p className="text-sm text-ink-muted font-serif">
            <span className="font-semibold text-ink-light">Best fit: </span>
            {content.best_fit_people}
          </p>
        )}
      </div>
    </SectionWrapper>
  )
}

export function WhatWeOffer({ content }: { content: Record<string, string> }) {
  if (!content.offer_description) return null
  return (
    <SectionWrapper>
      <SectionLabel>What We Offer</SectionLabel>
      <Prose className="max-w-2xl">{content.offer_description}</Prose>
    </SectionWrapper>
  )
}

export function PotentialImpact({
  content,
}: {
  content: { outcomes?: string[] }
}) {
  if (!content.outcomes?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Potential Impact</SectionLabel>
      <div className="max-w-2xl">
        <BulletList items={content.outcomes} />
      </div>
    </SectionWrapper>
  )
}

export function ResearcherPerspective({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.quote) return null
  return (
    <SectionWrapper>
      <Quote quote={content.quote} context={content.context} />
    </SectionWrapper>
  )
}

// ─── Researcher Profile Sections ─────────────────────────────────────────────

export function ResearcherHeader({
  content,
}: {
  content: Record<string, string>
}) {
  return (
    <div className="py-14 border-b border-parchment-border">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink
                       leading-tight mb-4">
          {content.researcher_name || 'Researcher'}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm
                        text-ink-muted font-serif">
          {content.role_career_stage && (
            <span className="font-semibold text-ink-light">
              {content.role_career_stage}
            </span>
          )}
          {content.institution && <span>{content.institution}</span>}
          {content.department_or_lab && <span>{content.department_or_lab}</span>}
        </div>
        {content.field_and_subfield && (
          <p className="mt-3 text-sm text-gold font-serif font-semibold">
            {content.field_and_subfield}
          </p>
        )}
      </div>
    </div>
  )
}

export function ResearcherIdentity({
  content,
}: {
  content: Record<string, string>
}) {
  return (
    <SectionWrapper>
      {content.mission_statement && (
        <p className="font-display text-2xl text-ink leading-snug mb-5 max-w-2xl">
          {content.mission_statement}
        </p>
      )}
      {content.identity_statement && (
        <Prose className="max-w-2xl mb-3">{content.identity_statement}</Prose>
      )}
      {content.plain_language_research_description && (
        <Prose className="max-w-2xl">
          {content.plain_language_research_description}
        </Prose>
      )}
    </SectionWrapper>
  )
}

export function ResearchThemes({
  content,
}: {
  content: { core_research_themes?: string[] }
}) {
  if (!content.core_research_themes?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Research Themes</SectionLabel>
      <TagList tags={content.core_research_themes} />
    </SectionWrapper>
  )
}

export function CurrentFocusSection({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.current_focus_description) return null
  return (
    <SectionWrapper>
      <SectionLabel>Current Focus</SectionLabel>
      <Prose className="max-w-2xl">{content.current_focus_description}</Prose>
    </SectionWrapper>
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
    <SectionWrapper>
      <SectionLabel>Expertise</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
        {hasMethods && (
          <div>
            <p className="text-xs text-ink-muted uppercase tracking-wide mb-3">
              Methods
            </p>
            <BulletList items={content.methods_expertise!} />
          </div>
        )}
        {hasDomain && (
          <div>
            <p className="text-xs text-ink-muted uppercase tracking-wide mb-3">
              Domain
            </p>
            <BulletList items={content.domain_expertise!} />
          </div>
        )}
      </div>
    </SectionWrapper>
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
    <SectionWrapper>
      <SectionLabel>Selected Projects</SectionLabel>
      <div className="space-y-5 max-w-2xl">
        {content.projects.map((p, i) => (
          <div key={i} className="space-y-1">
            <h3 className="font-display font-semibold text-ink">{p.project_title}</h3>
            <p className="text-sm text-ink-light leading-relaxed">{p.short_description}</p>
            {p.current_status && (
              <p className="text-xs text-ink-muted">{p.current_status}</p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function SelectedOutputs({
  content,
}: {
  content: {
    outputs?: Array<{ type: string; title: string; url?: string }>
  }
}) {
  if (!content.outputs?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Selected Work</SectionLabel>
      <div className="space-y-3 max-w-2xl">
        {content.outputs.map((o, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xs text-gold uppercase tracking-wide mt-0.5 w-16 shrink-0">
              {o.type}
            </span>
            {o.url ? (
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-light hover:text-ink underline
                           underline-offset-2 decoration-parchment-border
                           hover:decoration-gold transition-colors"
              >
                {o.title}
              </a>
            ) : (
              <p className="text-sm text-ink-light">{o.title}</p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function WhoTheyWantToReach({
  content,
}: {
  content: Record<string, string>
}) {
  if (!content.target_description) return null
  return (
    <SectionWrapper>
      <SectionLabel>Who I Want to Connect With</SectionLabel>
      <Prose className="max-w-2xl">{content.target_description}</Prose>
    </SectionWrapper>
  )
}

export function ResearcherAsks({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper className="bg-parchment-dark -mx-6 px-6 rounded-xl">
      <SectionLabel>What I Need</SectionLabel>
      <div className="max-w-2xl space-y-2">
        {content.primary_needs && <Prose>{content.primary_needs}</Prose>}
        {content.secondary_needs && (
          <Prose className="text-ink-muted">{content.secondary_needs}</Prose>
        )}
      </div>
    </SectionWrapper>
  )
}

export function WhatTheyOffer({ content }: { content: Record<string, string> }) {
  if (!content.offer_description) return null
  return (
    <SectionWrapper>
      <SectionLabel>What I Offer</SectionLabel>
      <Prose className="max-w-2xl">{content.offer_description}</Prose>
    </SectionWrapper>
  )
}

export function HumanLayer({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper>
      {content.researcher_perspective_quote && (
        <Quote
          quote={content.researcher_perspective_quote}
          context={content.why_this_work_matters_to_them}
        />
      )}
      {content.working_style_or_values && (
        <p className="mt-5 text-sm text-ink-muted max-w-xl font-serif italic">
          {content.working_style_or_values}
        </p>
      )}
    </SectionWrapper>
  )
}

export function Discoverability({
  content,
}: {
  content: {
    keywords_tags?: string[]
    website_links?: string[]
    publication_links?: string[]
    lab_link?: string
  }
}) {
  const hasLinks =
    content.website_links?.length ||
    content.publication_links?.length ||
    content.lab_link

  return (
    <SectionWrapper>
      {content.keywords_tags?.length && (
        <div className="mb-5">
          <SectionLabel>Keywords</SectionLabel>
          <TagList tags={content.keywords_tags} />
        </div>
      )}
      {hasLinks && (
        <div>
          <SectionLabel>Links</SectionLabel>
          <div className="space-y-1.5">
            {content.website_links?.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gold hover:text-gold-light
                           underline underline-offset-2 transition-colors"
              >
                {url}
              </a>
            ))}
            {content.publication_links?.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gold hover:text-gold-light
                           underline underline-offset-2 transition-colors"
              >
                {url}
              </a>
            ))}
            {content.lab_link && (
              <a
                href={content.lab_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gold hover:text-gold-light
                           underline underline-offset-2 transition-colors"
              >
                {content.lab_link}
              </a>
            )}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}

// ─── Lab Profile Sections ────────────────────────────────────────────────────

export function LabHeader({ content }: { content: Record<string, string> }) {
  return (
    <div className="py-14 border-b border-parchment-border">
      <div className="max-w-3xl">
        <p className="text-xs font-display font-semibold tracking-[0.15em]
                      uppercase text-gold mb-5">
          Lab Profile
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink
                       leading-tight mb-4">
          {content.lab_name || 'Lab'}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm
                        text-ink-muted font-serif">
          {content.pi_name && (
            <span className="font-semibold text-ink-light">PI: {content.pi_name}</span>
          )}
          {content.lab_lead_role && <span>{content.lab_lead_role}</span>}
          {content.institution && <span>{content.institution}</span>}
          {content.department && <span>{content.department}</span>}
        </div>
        {content.field_and_subfield && (
          <p className="mt-3 text-sm text-gold font-serif font-semibold">
            {content.field_and_subfield}
          </p>
        )}
      </div>
    </div>
  )
}

export function LabSummary({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper>
      {content.one_sentence_lab_summary && (
        <p className="font-display text-2xl text-ink leading-snug mb-5 max-w-2xl">
          {content.one_sentence_lab_summary}
        </p>
      )}
      {content.lab_mission_statement && (
        <Prose className="max-w-2xl mb-3">{content.lab_mission_statement}</Prose>
      )}
      {content.why_the_lab_exists && (
        <Prose className="max-w-2xl text-ink-muted">
          {content.why_the_lab_exists}
        </Prose>
      )}
    </SectionWrapper>
  )
}

export function ResearchAreas({
  content,
}: {
  content: { core_research_areas?: string[] }
}) {
  if (!content.core_research_areas?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Research Areas</SectionLabel>
      <TagList tags={content.core_research_areas} />
    </SectionWrapper>
  )
}

export function CurrentDirections({
  content,
}: {
  content: { active_directions?: string[] }
}) {
  if (!content.active_directions?.length) return null
  return (
    <SectionWrapper>
      <SectionLabel>Current Directions</SectionLabel>
      <div className="max-w-2xl">
        <BulletList items={content.active_directions} />
      </div>
    </SectionWrapper>
  )
}

export function FlagshipProjects({
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
    <SectionWrapper>
      <SectionLabel>Flagship Projects</SectionLabel>
      <div className="space-y-5 max-w-2xl">
        {content.projects.map((p, i) => (
          <div key={i} className="space-y-1">
            <h3 className="font-display font-semibold text-ink">{p.project_title}</h3>
            <p className="text-sm text-ink-light leading-relaxed">{p.short_description}</p>
            {p.current_status && (
              <p className="text-xs text-ink-muted">{p.current_status}</p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function TeamFit({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper>
      <SectionLabel>Team & Culture</SectionLabel>
      <div className="max-w-2xl space-y-3">
        {content.who_belongs_here && <Prose>{content.who_belongs_here}</Prose>}
        {content.lab_culture && (
          <Prose className="text-ink-muted">{content.lab_culture}</Prose>
        )}
        {content.mentorship_environment && (
          <Prose className="text-ink-muted">{content.mentorship_environment}</Prose>
        )}
      </div>
    </SectionWrapper>
  )
}

export function Opportunities({
  content,
}: {
  content: { recruiting_status?: string; open_opportunities?: string[] }
}) {
  if (!content.recruiting_status && !content.open_opportunities?.length) return null
  return (
    <SectionWrapper className="bg-parchment-dark -mx-6 px-6 rounded-xl">
      <SectionLabel>Open Opportunities</SectionLabel>
      <div className="max-w-2xl space-y-3">
        {content.recruiting_status && (
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-parchment
                          border border-parchment-border rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
            <span className="text-sm font-serif text-ink-muted">
              {content.recruiting_status}
            </span>
          </div>
        )}
        {content.open_opportunities?.length && (
          <BulletList items={content.open_opportunities} />
        )}
      </div>
    </SectionWrapper>
  )
}

export function LabAsks({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper>
      <SectionLabel>What We Need</SectionLabel>
      <div className="max-w-2xl space-y-2">
        {content.specific_needs_asks && (
          <Prose>{content.specific_needs_asks}</Prose>
        )}
        {content.best_fit_people_or_partners && (
          <p className="text-sm text-ink-muted font-serif">
            <span className="font-semibold text-ink-light">Best fit: </span>
            {content.best_fit_people_or_partners}
          </p>
        )}
      </div>
    </SectionWrapper>
  )
}

export function WhatTheLabOffers({ content }: { content: Record<string, string> }) {
  if (!content.offer_description) return null
  return (
    <SectionWrapper>
      <SectionLabel>What the Lab Offers</SectionLabel>
      <Prose className="max-w-2xl">{content.offer_description}</Prose>
    </SectionWrapper>
  )
}

export function ProofVisibility({
  content,
}: {
  content: {
    selected_publications_or_outputs?: Array<{
      type: string
      title: string
      url?: string
    }>
    research_tags?: string[]
    website_links?: string[]
  }
}) {
  const hasOutputs = content.selected_publications_or_outputs?.length
  const hasTags = content.research_tags?.length
  const hasLinks = content.website_links?.length
  if (!hasOutputs && !hasTags && !hasLinks) return null

  return (
    <SectionWrapper>
      {hasOutputs && (
        <div className="mb-6">
          <SectionLabel>Selected Work</SectionLabel>
          <div className="space-y-3 max-w-2xl">
            {content.selected_publications_or_outputs!.map((o, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs text-gold uppercase tracking-wide mt-0.5 w-16 shrink-0">
                  {o.type}
                </span>
                {o.url ? (
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-light hover:text-ink underline
                               underline-offset-2 decoration-parchment-border
                               hover:decoration-gold transition-colors"
                  >
                    {o.title}
                  </a>
                ) : (
                  <p className="text-sm text-ink-light">{o.title}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {hasTags && (
        <div className="mb-4">
          <SectionLabel>Tags</SectionLabel>
          <TagList tags={content.research_tags!} />
        </div>
      )}
      {hasLinks && (
        <div>
          <SectionLabel>Links</SectionLabel>
          <div className="space-y-1.5">
            {content.website_links!.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gold hover:text-gold-light
                           underline underline-offset-2 transition-colors"
              >
                {url}
              </a>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}

export function LabHumanLayer({ content }: { content: Record<string, string> }) {
  return (
    <SectionWrapper>
      {content.pi_or_lab_perspective_quote && (
        <Quote
          quote={content.pi_or_lab_perspective_quote}
          context={content.why_this_lab_cares_about_this_problem}
        />
      )}
    </SectionWrapper>
  )
}

// ─── Custom sections ─────────────────────────────────────────────────────────

export function CustomSections({
  sections,
}: {
  sections: Array<{ id: string; title: string; content: string }>
}) {
  if (!sections?.length) return null
  return (
    <>
      {sections.map((cs) => (
        <SectionWrapper key={cs.id}>
          {cs.title && <SectionLabel>{cs.title}</SectionLabel>}
          <p className="text-base leading-relaxed text-ink-light max-w-2xl
                        whitespace-pre-wrap">
            {cs.content}
          </p>
        </SectionWrapper>
      ))}
    </>
  )
}