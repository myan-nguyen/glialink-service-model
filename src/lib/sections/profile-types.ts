// V2 researcher profile — content types per section

export interface IdentityContent {
  name: string
  role: string
  institution: string
  group: string
  fieldDescriptor: string
  links?: Array<{ label: string; url: string }>
}

export interface InlineReference {
  label: string
  url: string | null
}

export interface WorkStatementContent {
  subtitle?: string
  paragraphs: string[]
  inlineReferences?: InlineReference[]
}

export interface FreshnessContent {
  pageCreatedAt: string
  lastEditedAt: string
}

export interface LinkedPaper {
  title: string
  url: string
  note?: string
}

export interface TrustStripContent {
  advisors?: string[]
  collaborators?: string[]
  funding?: string
  linkedPapers?: LinkedPaper[]
}

export type OpenToItemType = 'direct_ask' | 'open_invitation' | 'exploratory_note'

export interface OpenToItem {
  type: OpenToItemType
  body: string
  interestedLabel?: string
  forwardLabel?: string
}

export interface WhatImOpenToContent {
  items: OpenToItem[]
}

export interface WhatIBringContent {
  paragraphs: string[]
}

export interface ActiveProject {
  title: string
  oneLine: string
  url: string
  status?: 'active' | 'archived'
  links?: Array<{ label: string; url: string }>
}

export interface ResearchAreasContent {
  areas: string[]
}

export interface CurrentFocusContent {
  headline: string
  details?: string
}

export interface KeywordsContent {
  keywords: string[]
}

export interface ExpertiseContent {
  skills?: string[]
  domain?: string[]
  methods?: string[]
}

export interface ActiveProjectsContent {
  projects: ActiveProject[]
}

export interface PerspectiveContent {
  quote: string
  description: string
}

export interface GenericProseContent {
  paragraphs: string[]
}

export interface GenericListContent {
  items: string[]
}

// Wrapper for any v2 section stored in artifact.sections
export interface V2SectionEntry<T = Record<string, unknown>> {
  content: T
}

// The full shape of artifact.sections for a v2 researcher profile.
// Top-level keys outside of section names:
//   _v2: true               — schema version discriminator
//   _editDraft: EditDraft   — pending edits not yet published
export interface EditDraft {
  /** Which Tier 2 section keys are currently active in the draft editor */
  activeSections: string[]
  /** Pending content keyed by section name */
  sections: Record<string, V2SectionEntry>
}

export interface ResearcherProfileV2Sections {
  _v2: true
  _editDraft?: EditDraft | null
  identity?: V2SectionEntry<IdentityContent>
  workStatement?: V2SectionEntry<WorkStatementContent>
  freshness?: V2SectionEntry<FreshnessContent>
  trustStrip?: V2SectionEntry<TrustStripContent>
  researchAreas?: V2SectionEntry<ResearchAreasContent>
  currentFocus?: V2SectionEntry<CurrentFocusContent>
  keywords?: V2SectionEntry<KeywordsContent>
  expertise?: V2SectionEntry<ExpertiseContent>
  whatImOpenTo?: V2SectionEntry<WhatImOpenToContent>
  whatIBring?: V2SectionEntry<WhatIBringContent>
  activeProjects?: V2SectionEntry<ActiveProjectsContent>
  perspective?: V2SectionEntry<PerspectiveContent>
  pastProjects?: V2SectionEntry<GenericProseContent>
  selectedPublications?: V2SectionEntry<GenericListContent>
  talksAndAppearances?: V2SectionEntry<GenericListContent>
  writingAndMedia?: V2SectionEntry<GenericListContent>
  teachingAndMentorship?: V2SectionEntry<GenericProseContent>
  background?: V2SectionEntry<GenericProseContent>
  education?: V2SectionEntry<GenericListContent>
}
