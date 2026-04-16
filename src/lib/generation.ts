import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ─── File fetching ───────────────────────────────────────────────────────────

type FileBlock =
  | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } }
  | { type: 'image'; source: { type: 'base64'; media_type: 'image/png' | 'image/jpeg'; data: string } }

export async function fetchUploadedFiles(
  filePaths: string[]
): Promise<FileBlock[]> {
  if (!filePaths || filePaths.length === 0) return []

  const supabase = createServiceClient()
  const blocks: FileBlock[] = []

  for (const path of filePaths) {
    try {
      // Get a short-lived signed URL
      const { data: signedData, error: signedError } = await supabase.storage
        .from('researcher-materials')
        .createSignedUrl(path, 60) // 60 second expiry

      if (signedError || !signedData?.signedUrl) continue

      const response = await fetch(signedData.signedUrl)
      if (!response.ok) continue

      const buffer = await response.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const ext = path.split('.').pop()?.toLowerCase()

      if (ext === 'pdf') {
        blocks.push({
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 },
        })
      } else if (ext === 'png') {
        blocks.push({
          type: 'image',
          source: { type: 'base64', media_type: 'image/png', data: base64 },
        })
      } else if (ext === 'jpg' || ext === 'jpeg') {
        blocks.push({
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
        })
      }
    } catch {
      // Skip files that fail — do not block generation
      continue
    }
  }

  return blocks
}

// ─── JSON parse with retry ───────────────────────────────────────────────────

export function parseGenerationResponse(text: string): Record<string, unknown> {
  // Strip markdown fences if Claude wraps them despite instructions
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  return JSON.parse(cleaned)
}

// ─── Section order per output type ───────────────────────────────────────────

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