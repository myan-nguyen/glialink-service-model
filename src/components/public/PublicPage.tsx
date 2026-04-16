import type { Artifact } from '@/lib/types'
import * as R from './SectionRenderers'

function get(sections: Record<string, { content: Record<string, unknown> }>, key: string) {
  return (sections[key]?.content ?? {}) as Record<string, never>
}

export function PublicPage({ artifact }: { artifact: Artifact }) {
  const s = artifact.sections as Record<
    string,
    { content: Record<string, unknown> }
  >
  const customSections = (
    (s.custom_sections as unknown) ?? []
  ) as Array<{ id: string; title: string; content: string }>

  if (artifact.output_type === 'project_page') {
    return (
      <>
        <R.ProjectHeader content={get(s, 'header')} />
        <R.ProjectSummary content={get(s, 'summary')} />
        <R.CurrentStage content={get(s, 'current_stage')} />
        <R.WhyThisMatters content={get(s, 'why_this_matters')} />
        <R.ResearchFocus content={get(s, 'research_focus')} />
        <R.MethodsApproach content={get(s, 'methods_approach')} />
        <R.KeyFindings content={get(s, 'key_findings')} />
        <R.ResearchTags content={get(s, 'research_tags')} />
        <R.ProjectAsks content={get(s, 'asks')} />
        <R.WhatWeOffer content={get(s, 'what_we_offer')} />
        <R.PotentialImpact content={get(s, 'potential_impact')} />
        <R.ResearcherPerspective content={get(s, 'researcher_perspective')} />
        <R.CustomSections sections={customSections} />
      </>
    )
  }

  if (artifact.output_type === 'researcher_profile') {
    return (
      <>
        <R.ResearcherHeader content={get(s, 'header')} />
        <R.ResearcherIdentity content={get(s, 'identity')} />
        <R.ResearchThemes content={get(s, 'research_themes')} />
        <R.CurrentFocusSection content={get(s, 'current_focus')} />
        <R.ExpertiseSection content={get(s, 'expertise')} />
        <R.SelectedProjects content={get(s, 'selected_projects')} />
        <R.SelectedOutputs content={get(s, 'selected_outputs')} />
        <R.WhoTheyWantToReach content={get(s, 'who_they_want_to_reach')} />
        <R.ResearcherAsks content={get(s, 'asks')} />
        <R.WhatTheyOffer content={get(s, 'what_they_offer')} />
        <R.HumanLayer content={get(s, 'human_layer')} />
        <R.Discoverability content={get(s, 'discoverability')} />
        <R.CustomSections sections={customSections} />
      </>
    )
  }

  if (artifact.output_type === 'lab_profile') {
    return (
      <>
        <R.LabHeader content={get(s, 'header')} />
        <R.LabSummary content={get(s, 'summary')} />
        <R.ResearchAreas content={get(s, 'research_areas')} />
        <R.CurrentDirections content={get(s, 'current_directions')} />
        <R.FlagshipProjects content={get(s, 'flagship_projects')} />
        <R.TeamFit content={get(s, 'team_fit')} />
        <R.Opportunities content={get(s, 'opportunities')} />
        <R.LabAsks content={get(s, 'asks')} />
        <R.WhatTheLabOffers content={get(s, 'what_the_lab_offers')} />
        <R.ProofVisibility content={get(s, 'proof_visibility')} />
        <R.LabHumanLayer content={get(s, 'human_layer')} />
        <R.CustomSections sections={customSections} />
      </>
    )
  }

  return null
}