import type { Artifact } from '@/lib/types'
import * as P from './project-sections'
import * as R from './researcher-sections'
import * as L from './lab-sections'
import { CustomSections } from './custom-sections'

function get(
  sections: Record<string, { content: Record<string, unknown> }>,
  key: string
) {
  return (sections[key]?.content ?? {}) as Record<string, never>
}

export function PublicPage({ artifact }: { artifact: Artifact }) {
  const s = artifact.sections as Record<
    string,
    { content: Record<string, unknown> }
  >
  const customSections = ((s.custom_sections as unknown) ?? []) as Array<{
    id: string
    title: string
    content: string
  }>

  if (artifact.output_type === 'project_page') {
    const asksContent = get(s, 'asks') as Record<string, unknown>
    // Support either shape: {ask_title, ...} or {asks: [...]}
    const asksArray =
      Array.isArray(asksContent?.asks)
        ? (asksContent.asks as Array<{
            ask_title?: string
            ask_description?: string
            best_fit_people?: string
          }>)
        : asksContent.ask_title || asksContent.ask_description
          ? [
              {
                ask_title: asksContent.ask_title as string,
                ask_description: asksContent.ask_description as string,
                best_fit_people: asksContent.best_fit_people as string,
              },
            ]
          : []

    return (
      <>
        <P.ProjectHeader content={get(s, 'header')} />
        <P.CurrentStage content={get(s, 'current_stage')} />
        <P.ProjectSummary content={get(s, 'summary')} />
        <P.WhyThisMatters content={get(s, 'why_this_matters')} />
        <P.ResearchFocus content={get(s, 'research_focus')} />
        <P.MethodsApproach content={get(s, 'methods_approach')} />
        <P.KeyFindings content={get(s, 'key_findings')} />
        <P.ResearchTags content={get(s, 'research_tags')} />
        <P.FiguresEvidence content={get(s, 'figures_evidence')} />
        <P.ProjectAsksList asks={asksArray} />
        <P.WhatWeOffer content={get(s, 'what_we_offer')} />
        <P.PotentialImpact content={get(s, 'potential_impact')} />
        <P.ResearcherPerspective content={get(s, 'researcher_perspective')} />
        <CustomSections sections={customSections} />
      </>
    )
  }

  if (artifact.output_type === 'researcher_profile') {
    return (
      <div className="space-y-5 sm:space-y-6 pb-4">
        <R.ResearcherHero content={get(s, 'header')} />
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
        <CustomSections sections={customSections} cardStyle />
      </div>
    )
  }

  if (artifact.output_type === 'lab_profile') {
    return (
      <div className="space-y-5 sm:space-y-6 pb-4">
        <L.LabHero content={get(s, 'header')} />
        <L.LabSummary content={get(s, 'summary')} />
        <L.ResearchAreas content={get(s, 'research_areas')} />
        <L.Opportunities content={get(s, 'opportunities')} />
        <L.CurrentDirections content={get(s, 'current_directions')} />
        <L.FlagshipProjects content={get(s, 'flagship_projects')} />
        <L.Capabilities content={get(s, 'capabilities')} />
        <L.TeamFit content={get(s, 'team_fit')} />
        <L.LabAsks content={get(s, 'asks')} />
        <L.WhatTheLabOffers content={get(s, 'what_the_lab_offers')} />
        <L.ProofVisibility content={get(s, 'proof_visibility')} />
        <L.LabHumanLayer content={get(s, 'human_layer')} />
        <CustomSections sections={customSections} cardStyle />
      </div>
    )
  }

  return null
}