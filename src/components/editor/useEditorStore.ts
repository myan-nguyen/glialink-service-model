import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { SectionSuggestion } from '@/lib/types'

export interface SectionData {
  content: Record<string, unknown>
  confidence: 'high' | 'medium' | 'low'
  evidence: string
  follow_up_needed: string | null
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

interface EditorState {
  // Data
  sections: Record<string, SectionData>
  customSections: CustomSection[]
  selectedSection: string | null
  generationStatus: 'pending' | 'generating' | 'complete' | 'failed'
  generationError: string | null

  // UI state
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean

  // Actions
  initSections: (
    sections: Record<string, SectionData>,
    status: string,
    error: string | null
  ) => void
  updateSectionContent: (sectionName: string, field: string, value: unknown) => void
  updateSection: (sectionName: string, data: SectionData) => void
  selectSection: (name: string | null) => void
  setGenerationStatus: (
    status: 'pending' | 'generating' | 'complete' | 'failed',
    error?: string | null
  ) => void
  setIsDirty: (v: boolean) => void
  setIsSaving: (v: boolean) => void
  setIsPublishing: (v: boolean) => void

  // Custom sections
  addCustomSection: (title?: string, content?: string) => void
  updateCustomSection: (id: string, field: 'title' | 'content', value: string) => void
  removeCustomSection: (id: string) => void

  // Section suggestions
  sectionSuggestions: SectionSuggestion[]
  dismissedSuggestions: string[]
  setSectionSuggestions: (suggestions: SectionSuggestion[]) => void
  dismissSuggestion: (key: string) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  sections: {},
  customSections: [],
  selectedSection: null,
  generationStatus: 'pending',
  generationError: null,
  isDirty: false,
  isSaving: false,
  isPublishing: false,
  sectionSuggestions: [],
  dismissedSuggestions: [],

  initSections: (sections, status, error) => {
    // Strip custom_sections — it is an array, not SectionData; it lives in customSections state
    const { custom_sections: _stripped, ...rest } = sections as Record<string, unknown>
    const clean = rest as Record<string, SectionData>

    // Migrate old flat asks format { ask_title, ask_description, best_fit_people }
    // to the new items-array format { items: [...] }
    const migrated = { ...clean }
    const asksContent = migrated.asks?.content as Record<string, unknown> | undefined
    if (asksContent && !Array.isArray(asksContent.items)) {
      const { ask_title, ask_description, best_fit_people, ...restAsks } = asksContent
      migrated.asks = {
        ...migrated.asks!,
        content: {
          ...restAsks,
          items: [{ ask_title: ask_title ?? '', ask_description: ask_description ?? '', best_fit_people: best_fit_people ?? '' }],
        },
      }
    }
    set({
      sections: migrated,
      generationStatus: status as EditorState['generationStatus'],
      generationError: error,
    })
  },

  updateSectionContent: (sectionName, field, value) =>
    set((state) => ({
      isDirty: true,
      sections: {
        ...state.sections,
        [sectionName]: {
          ...state.sections[sectionName],
          content: {
            ...state.sections[sectionName]?.content,
            [field]: value,
          },
        },
      },
    })),

  updateSection: (sectionName, data) =>
    set((state) => ({
      isDirty: true,
      sections: { ...state.sections, [sectionName]: data },
    })),

  selectSection: (name) => set({ selectedSection: name }),

  setGenerationStatus: (status, error = null) =>
    set({ generationStatus: status, generationError: error }),

  setIsDirty: (v) => set({ isDirty: v }),
  setIsSaving: (v) => set({ isSaving: v }),
  setIsPublishing: (v) => set({ isPublishing: v }),

  addCustomSection: (title = '', content = '') =>
    set((state) => ({
      isDirty: true,
      customSections: [
        ...state.customSections,
        { id: nanoid(), title, content },
      ],
    })),

  updateCustomSection: (id, field, value) =>
    set((state) => ({
      isDirty: true,
      customSections: state.customSections.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    })),

  removeCustomSection: (id) =>
    set((state) => ({
      isDirty: true,
      customSections: state.customSections.filter((s) => s.id !== id),
    })),

  setSectionSuggestions: (suggestions) => set({ sectionSuggestions: suggestions }),
  dismissSuggestion: (key) =>
    set((state) => ({ dismissedSuggestions: [...state.dismissedSuggestions, key] })),
}))