export type CareerStage =
  | 'Undergrad' | 'Grad' | 'Postdoc'
  | 'Early-career PI' | 'Senior PI' | 'Lab Manager' | 'Other'

export type AiComfort = 'Yes' | 'No' | 'With conditions'

export type OutputType = 'project_page' | 'researcher_profile' | 'lab_profile'

export type ArtifactStatus = 'draft' | 'published'

export type PrimaryGoal =
  | 'Find specific collaborators'
  | 'Attract students/recruits'
  | 'Increase general visibility'
  | 'Communicate for a specific event'
  | 'Get help navigating university resources'
  | 'Not sure yet'

export type TargetAudience =
  | 'Peers in my subfield'
  | 'Students'
  | 'Industry partners'
  | 'Community organizations'
  | 'Funders'
  | 'General public'
  | 'Other'

export interface SupplementalLink {
  label: string
  url: string
}

// Researcher record (identity-level)
export interface Researcher {
  id: string
  email: string
  full_name: string | null
  institution: string | null
  department_or_lab: string | null
  role_career_stage: CareerStage | null
  field_and_subfield: string | null
  plain_language_research_description: string | null
  ai_comfort: AiComfort | null
  additional_notes: string | null
  supplemental_links: SupplementalLink[]
  deleted_at: string | null
  created_at: string
  updated_at: string
}

// intake_data shapes per output type
export interface ProjectPageIntake {
  project_title: string
  active_project_description: string
  primary_goal: PrimaryGoal | ''
  target_audience: TargetAudience[]
  specific_needs_asks: string
  what_you_offer: string
  file_uploads: string[]
  anything_not_public: string
}

export interface ResearcherProfileIntake {
  current_focus: string
  who_you_want_to_reach: string
  what_you_offer: string
  file_uploads: string[]
  anything_not_public: string
}

export interface LabProfileIntake {
  lab_name: string
  pi_name: string
  pi_email: string
  pi_career_stage: CareerStage | ''
  lab_mission: string
  current_directions: string
  who_belongs_here: string
  open_opportunities: string
  what_the_lab_offers: string
  file_uploads: string[]
  anything_not_public: string
}

export type IntakeData =
  | ProjectPageIntake
  | ResearcherProfileIntake
  | LabProfileIntake

// Section metadata wrapper (every generated section)
export interface SectionMeta {
  confidence: 'high' | 'medium' | 'low'
  evidence: string
  follow_up_needed: string | null
}

// Artifact record
export interface Artifact {
  id: string
  researcher_email: string
  output_type: OutputType
  status: ArtifactStatus
  slug: string | null
  intake_data: IntakeData
  sections: Record<string, { content: Record<string, unknown> } & SectionMeta>
  page_readiness: {
    is_ready_to_generate: boolean
    strongest_sections: string[]
    weakest_sections: string[]
    missing_information_that_would_improve_page: string[]
  } | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  generation_status: 'pending' | 'generating' | 'complete' | 'failed'
  generation_error: string | null
}

// Dashboard row shape returned by /api/admin/artifacts
export interface ArtifactRow {
  id: string
  output_type: OutputType
  status: ArtifactStatus
  slug: string | null
  generation_status: 'pending' | 'generating' | 'complete' | 'failed'
  created_at: string
  updated_at: string
  published_at: string | null
  deleted_at: string | null
  researchers: {
    full_name: string | null
    email: string
    institution: string | null
    department_or_lab: string | null
  } | null
}