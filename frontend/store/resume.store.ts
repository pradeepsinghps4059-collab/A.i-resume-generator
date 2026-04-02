/**
 * store/resume.store.ts - Resume Editor State
 */

import { create } from 'zustand';
import type { Resume, ActiveSection } from '@/types/resume';

interface ResumeStore {
  // Current resume being edited
  currentResume: Resume | null;
  isDirty: boolean; // Unsaved changes flag
  activeSection: ActiveSection;
  isSaving: boolean;
  isPreviewMode: boolean;

  // Actions
  setResume: (resume: Resume) => void;
  updateResume: (updates: Partial<Resume>) => void;
  setActiveSection: (section: ActiveSection) => void;
  setSaving: (saving: boolean) => void;
  setPreviewMode: (preview: boolean) => void;
  markClean: () => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  currentResume: null,
  isDirty: false,
  activeSection: 'personal',
  isSaving: false,
  isPreviewMode: false,

  setResume: (resume) => set({ currentResume: resume, isDirty: false }),

  updateResume: (updates) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, ...updates }
        : null,
      isDirty: true,
    })),

  setActiveSection: (activeSection) => set({ activeSection }),
  setSaving: (isSaving) => set({ isSaving }),
  setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
  markClean: () => set({ isDirty: false }),
  resetResume: () =>
    set({ currentResume: null, isDirty: false, activeSection: 'personal' }),
}));
