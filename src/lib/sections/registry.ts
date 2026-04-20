export type SectionTier = 1 | 2 | 3

export interface SectionDef {
  key: string
  label: string
  tier: SectionTier
  /** Shown as the empty-slot prompt in the editor */
  emptyPrompt?: string
}

function def(key: string, label: string, tier: SectionTier, emptyPrompt?: string): SectionDef {
  return { key, label, tier, emptyPrompt }
}

export const SECTION_REGISTRY: Record<string, SectionDef> = {
  // Tier 1 — always render, cannot be removed
  identity:               def('identity',               'Identity',               1),
  workStatement:          def('workStatement',          'About',                  1),
  freshness:              def('freshness',              'Freshness',              1),
  reachOut:               def('reachOut',               'Reach Out',              1),
  researchAreas:          def('researchAreas',          'Research Areas',         1, 'List your main research areas.'),
  currentFocus:           def('currentFocus',           'Current Focus',          1, 'Describe what you are currently focused on.'),
  keywords:               def('keywords',               'Keywords',               1, 'Add keywords that describe your work.'),
  // Tier 2 — default-shown, researcher can remove; publish only if content exists
  expertise:              def('expertise',              'Expertise',              2, 'Add your skills, domain knowledge, and methods as tags.'),
  trustStrip:             def('trustStrip',             'Affiliations',           2, 'Add advisors, collaborators, funding, or linked papers.'),
  whatImOpenTo:           def('whatImOpenTo',           "What I'm Looking For",   2, "Add what you're looking for — direct asks, open invitations, or exploratory notes."),
  whatIBring:             def('whatIBring',             'What I Offer',           2, 'Describe your expertise and what you offer collaborators.'),
  activeProjects:         def('activeProjects',         'Selected Projects',      2, 'List your selected projects with links.'),
  perspective:            def('perspective',            'Perspective',            2, 'A quote and brief characterization.'),
  // Tier 3 — optional, not shown by default; researcher adds via "Add section"
  pastProjects:           def('pastProjects',           'Past Projects',          3, 'Completed projects.'),
  selectedPublications:   def('selectedPublications',   'Selected Publications',  3, 'Academic publications — distinct from active projects.'),
  talksAndAppearances:    def('talksAndAppearances',    'Talks & Appearances',    3, 'Invited talks, conference presentations, podcasts.'),
  writingAndMedia:        def('writingAndMedia',        'Writing & Media',        3, 'Blog posts, op-eds, interviews, long-form writing.'),
  teachingAndMentorship:  def('teachingAndMentorship',  'Teaching & Mentorship',  3, 'Courses taught, advisees, mentored RAs.'),
  background:             def('background',             'Background',             3, 'Career arc in prose.'),
  education:              def('education',              'Education',              3, 'Degrees and institutions.'),
}

export const TIER_1_KEYS = Object.values(SECTION_REGISTRY)
  .filter((s) => s.tier === 1).map((s) => s.key)

export const TIER_2_KEYS = Object.values(SECTION_REGISTRY)
  .filter((s) => s.tier === 2).map((s) => s.key)

export const TIER_3_KEYS = Object.values(SECTION_REGISTRY)
  .filter((s) => s.tier === 3).map((s) => s.key)
