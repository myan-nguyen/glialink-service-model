import type { Artifact } from '@/lib/types'
import { TileGrid, CustomSections } from './shared'
import {
  ProjectHeader,
  CurrentStagePill,
  ProjectSummary,
  WhyThisMatters,
  ResearchFocus,
  FiguresEvidence,
  ProjectAsks,
  ResearcherPerspective,
  TileResearchTags,
  TileKeyFindings,
  TileMethods,
  TilePotentialImpact,
  TileWhatWeOffer,
} from './project-sections'
import {
  ResearcherHeader,
  ResearcherIdentity,
  ExpertiseSection,
  SelectedProjects,
  HumanLayer,
  TileResearchThemes,
  TileCurrentFocus,
  TileDiscoverability,
  TileSelectedOutputs,
  TileResearcherAsks,
  TileWhatTheyOffer,
} from './researcher-sections'
import {
  LabHeader,
  LabSummary,
  FlagshipProjects,
  TeamFit,
  Opportunities,
  LabHumanLayer,
  TileResearchAreas,
  TileCurrentDirections,
  TileCapabilities,
  TileLabAsks,
  TileLabOffers,
  TileProofVisibility,
} from './lab-sections'

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
  const customSections = (
    (s.custom_sections as unknown) ?? []
  ) as Array<{ id: string; title: string; content: string }>

  if (artifact.output_type === 'project_page') {
    return (
      <article>
        <ProjectHeader content={get(s, 'header')} />
        <CurrentStagePill content={get(s, 'current_stage')} />
        <ProjectSummary content={get(s, 'summary')} />
        <WhyThisMatters content={get(s, 'why_this_matters')} />
        <ResearchFocus content={get(s, 'research_focus')} />

        <TileGrid columns={3} tileHeight="h-64">
          <TileResearchTags content={get(s, 'research_tags')} />
          <TileMethods content={get(s, 'methods_approach')} />
          <TilePotentialImpact content={get(s, 'potential_impact')} />
        </TileGrid>

        <TileGrid columns={2} tileHeight="h-80">
          <TileKeyFindings content={get(s, 'key_findings')} />
          <TileWhatWeOffer content={get(s, 'what_we_offer')} />
        </TileGrid>

        <FiguresEvidence content={get(s, 'figures_evidence')} />
        <ProjectAsks content={get(s, 'asks')} />
        <ResearcherPerspective content={get(s, 'researcher_perspective')} />
        <CustomSections sections={customSections} />
      </article>
    )
  }

  if (artifact.output_type === 'researcher_profile') {
    return (
      <article>
        <ResearcherHeader content={get(s, 'header')} />
        <ResearcherIdentity content={get(s, 'identity')} />

        <TileGrid columns={3} tileHeight="h-64">
          <TileResearchThemes content={get(s, 'research_themes')} />
          <TileCurrentFocus content={get(s, 'current_focus')} />
          <TileDiscoverability content={get(s, 'discoverability')} />
        </TileGrid>

        <ExpertiseSection content={get(s, 'expertise')} />
        <SelectedProjects content={get(s, 'selected_projects')} />

        <TileGrid columns={3} tileHeight="h-80">
          <TileSelectedOutputs content={get(s, 'selected_outputs')} />
          <TileResearcherAsks content={get(s, 'asks')} />
          <TileWhatTheyOffer content={get(s, 'what_they_offer')} />
        </TileGrid>

        <HumanLayer content={get(s, 'human_layer')} />
        <CustomSections sections={customSections} />
      </article>
    )
  }

  if (artifact.output_type === 'lab_profile') {
    return (
      <article>
        <LabHeader content={get(s, 'header')} />
        <LabSummary content={get(s, 'summary')} />

        <TileGrid columns={3} tileHeight="h-64">
          <TileResearchAreas content={get(s, 'research_areas')} />
          <TileCurrentDirections content={get(s, 'current_directions')} />
          <TileCapabilities content={get(s, 'capabilities')} />
        </TileGrid>

        <FlagshipProjects content={get(s, 'flagship_projects')} />
        <TeamFit content={get(s, 'team_fit')} />
        <Opportunities content={get(s, 'opportunities')} />

        <TileGrid columns={3} tileHeight="h-72">
          <TileLabAsks content={get(s, 'asks')} />
          <TileLabOffers content={get(s, 'what_the_lab_offers')} />
          <TileProofVisibility content={get(s, 'proof_visibility')} />
        </TileGrid>

        <LabHumanLayer content={get(s, 'human_layer')} />
        <CustomSections sections={customSections} />
      </article>
    )
  }

  return null
}