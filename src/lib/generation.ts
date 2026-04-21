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

  const results = await Promise.all(
    filePaths.map(async (path): Promise<FileBlock | null> => {
      try {
        const { data: signedData, error: signedError } = await supabase.storage
          .from('researcher-materials')
          .createSignedUrl(path, 60)

        if (signedError || !signedData?.signedUrl) return null

        const response = await fetch(signedData.signedUrl)
        if (!response.ok) return null

        const buffer = await response.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        const ext = path.split('.').pop()?.toLowerCase()

        if (ext === 'pdf') {
          return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
        } else if (ext === 'png') {
          return { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64 } }
        } else if (ext === 'jpg' || ext === 'jpeg') {
          return { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } }
        }
        return null
      } catch {
        return null
      }
    })
  )

  return results.filter((b): b is FileBlock => b !== null)
}

// ─── JSON parse ──────────────────────────────────────────────────────────────

export function parseGenerationResponse(text: string): Record<string, unknown> {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  return JSON.parse(cleaned)
}
