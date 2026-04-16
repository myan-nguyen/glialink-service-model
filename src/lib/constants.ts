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