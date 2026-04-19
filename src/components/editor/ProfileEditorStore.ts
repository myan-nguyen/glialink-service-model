import { create } from 'zustand'
import type { EditDraft, V2SectionEntry } from '@/lib/sections/profile-types'
import { TIER_2_KEYS } from '@/lib/sections/registry'

interface ProfileEditorState {
  // Current draft state
  draft: EditDraft
  // Which Tier 3 keys have been added by the researcher
  addedTier3: string[]

  // UI
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean
  previewMode: boolean

  // Actions
  initFromSections: (
    publishedSections: Record<string, unknown>,
    existingDraft: EditDraft | null | undefined
  ) => void
  updateSectionContent: (key: string, content: Record<string, unknown>) => void
  removeSection: (key: string) => void
  addTier3Section: (key: string) => void
  setPreviewMode: (v: boolean) => void
  setIsDirty: (v: boolean) => void
  setIsSaving: (v: boolean) => void
  setIsPublishing: (v: boolean) => void
  getDraftSectionsForPreview: () => Record<string, V2SectionEntry>
}

export const useProfileEditorStore = create<ProfileEditorState>((set, get) => ({
  draft: { activeSections: [...TIER_2_KEYS], sections: {} },
  addedTier3: [],
  isDirty: false,
  isSaving: false,
  isPublishing: false,
  previewMode: false,

  initFromSections: (publishedSections, existingDraft) => {
    if (existingDraft) {
      // Resume saved draft
      const addedTier3 = existingDraft.activeSections.filter(
        (k) => !TIER_2_KEYS.includes(k)
      )
      set({ draft: existingDraft, addedTier3, isDirty: false })
      return
    }
    // Build fresh draft from published sections
    const sections: Record<string, V2SectionEntry> = {}
    for (const [key, value] of Object.entries(publishedSections)) {
      if (key.startsWith('_')) continue
      if (value && typeof value === 'object' && 'content' in value) {
        sections[key] = value as V2SectionEntry
      }
    }
    set({
      draft: { activeSections: [...TIER_2_KEYS], sections },
      addedTier3: [],
      isDirty: false,
    })
  },

  updateSectionContent: (key, content) =>
    set((state) => ({
      isDirty: true,
      draft: {
        ...state.draft,
        sections: {
          ...state.draft.sections,
          [key]: { content },
        },
      },
    })),

  removeSection: (key) =>
    set((state) => ({
      isDirty: true,
      draft: {
        ...state.draft,
        activeSections: state.draft.activeSections.filter((k) => k !== key),
      },
      addedTier3: state.addedTier3.filter((k) => k !== key),
    })),

  addTier3Section: (key) =>
    set((state) => {
      if (state.draft.activeSections.includes(key)) return state
      return {
        isDirty: true,
        addedTier3: [...state.addedTier3, key],
        draft: {
          ...state.draft,
          activeSections: [...state.draft.activeSections, key],
        },
      }
    }),

  setPreviewMode: (v) => set({ previewMode: v }),
  setIsDirty: (v) => set({ isDirty: v }),
  setIsSaving: (v) => set({ isSaving: v }),
  setIsPublishing: (v) => set({ isPublishing: v }),

  getDraftSectionsForPreview: () => {
    const { draft } = get()
    const result: Record<string, V2SectionEntry> = {}
    for (const key of draft.activeSections) {
      if (draft.sections[key]) result[key] = draft.sections[key]
    }
    return result
  },
}))
