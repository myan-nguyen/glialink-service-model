import type { CareerStage, PrimaryGoal, TargetAudience, AiComfort } from './types'

export const CAREER_STAGES: CareerStage[] = [
  'Undergrad', 'Grad', 'Postdoc',
  'Early-career PI', 'Senior PI', 'Lab Manager', 'Other'
]

export const PRIMARY_GOALS: PrimaryGoal[] = [
  'Find specific collaborators',
  'Attract students/recruits',
  'Increase general visibility',
  'Communicate for a specific event',
  'Get help navigating university resources',
  'Not sure yet'
]

export const TARGET_AUDIENCES: TargetAudience[] = [
  'Peers in my subfield',
  'Students',
  'Industry partners',
  'Community organizations',
  'Funders',
  'General public',
  'Other'
]

export const AI_COMFORT_OPTIONS: AiComfort[] = [
  'Yes', 'No', 'With conditions'
]

export const CTA_EMAIL = process.env.CTA_EMAIL ?? 'myan_nguyen@brown.edu'

export const SECTION_LABELS: Record<string, string> = {
  // Project page
  header: 'Header',
  summary: 'Summary',
  why_this_matters: 'Why This Matters',
  research_focus: 'Research Focus',
  methods_approach: 'Methods & Approach',
  key_findings: 'Key Findings',
  research_tags: 'Research Tags',
  current_stage: 'Current Stage',
  figures_evidence: 'Figures & Evidence',
  asks: 'Asks',
  what_we_offer: 'What We Offer',
  potential_impact: 'Potential Impact',
  researcher_perspective: 'Researcher Perspective',
  cta: 'Call to Action',
  constraints: 'Constraints',
  // Researcher profile
  identity: 'Identity',
  research_themes: 'Research Areas',
  current_focus: 'Current Focus',
  expertise: 'Expertise',
  selected_projects: 'Selected Projects',
  selected_outputs: 'Selected Outputs',
  who_they_want_to_reach: 'Who They Want to Reach',
  what_they_offer: 'What They Offer',
  human_layer: 'Human Layer',
  discoverability: 'Discoverability',
  // Lab profile
  research_areas: 'Research Areas',
  current_directions: 'Current Directions',
  flagship_projects: 'Flagship Projects',
  capabilities: 'Capabilities',
  team_fit: 'Team Fit',
  opportunities: 'Opportunities',
  what_the_lab_offers: 'What the Lab Offers',
  proof_visibility: 'Proof & Visibility',
}

export const CONFIDENCE_COLORS = {
  high: 'text-black bg-green-200 border-green-300',
  medium: 'text-black bg-yellow-200 border-yellow-300',
  low: 'text-black bg-red-200 border-red-300',
}

// Fields that render as single-line inputs (short text)
export const SHORT_TEXT_FIELDS = new Set([
  'researcher_name', 'researcher_role', 'institution', 'department_or_lab',
  'project_title', 'project_type_label', 'current_stage', 'call_to_action',
  'ask_title', 'lab_name', 'pi_name', 'pi_email', 'lab_lead_role',
  'field_and_subfield', 'role_career_stage', 'recruiting_status',
  'one_sentence_summary', 'one_sentence_lab_summary', 'mission_statement',
  'lab_link', 'ai_comfort',
])

export const SECTION_ORDER: Record<string, string[]> = {
  project_page: [
    'header', 'summary', 'why_this_matters', 'research_focus',
    'methods_approach', 'key_findings', 'research_tags', 'current_stage',
    'figures_evidence', 'asks', 'what_we_offer', 'potential_impact',
    'researcher_perspective', 'cta', 'constraints',
  ],
  researcher_profile: [
    'header', 'identity', 'research_themes', 'current_focus', 'expertise',
    'selected_projects', 'selected_outputs', 'who_they_want_to_reach',
    'asks', 'what_they_offer', 'human_layer', 'discoverability', 'constraints',
  ],
  lab_profile: [
    'header', 'summary', 'research_areas', 'current_directions',
    'flagship_projects', 'capabilities', 'team_fit', 'opportunities',
    'asks', 'what_the_lab_offers', 'proof_visibility', 'human_layer', 'constraints',
  ],
}