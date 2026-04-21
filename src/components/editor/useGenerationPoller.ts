import { useEffect, useRef } from 'react'
import { useEditorStore, SectionData } from './useEditorStore'

export function useGenerationPoller(
  artifactId: string,
  initialStatus: string
) {
  const { setGenerationStatus, initSections, setSectionSuggestions } = useEditorStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Already complete or failed — no polling needed
    if (initialStatus === 'complete' || initialStatus === 'failed') return

    const poll = async () => {
      try {
        const res = await fetch(`/api/generate/status/${artifactId}`)
        if (!res.ok) return

        const data = await res.json()

        if (data.generation_status === 'complete') {
          initSections(
            data.sections as Record<string, SectionData>,
            'complete',
            null
          )
          setSectionSuggestions(data.page_readiness?.section_suggestions ?? [])
          if (intervalRef.current) clearInterval(intervalRef.current)
        } else if (data.generation_status === 'failed') {
          setGenerationStatus('failed', data.generation_error)
          if (intervalRef.current) clearInterval(intervalRef.current)
        } else {
          setGenerationStatus(data.generation_status)
        }
      } catch {
        // Network error — keep polling
      }
    }

    intervalRef.current = setInterval(poll, 2000)
    poll() // Immediate first poll

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [artifactId, initialStatus])
}