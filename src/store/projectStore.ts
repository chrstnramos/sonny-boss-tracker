import { create } from 'zustand'
import type { Project } from '../types'
import { saveProjects, saveActiveProjectId, clearProjectData } from '../storage/adapter'
import { deleteProjectFromFirestore } from '../storage/firestore'
import { isFirebaseConfigured } from '../lib/firebase'

export const STX_PROJECT_ID = 'stx-promo-90day'

interface ProjectStore {
  projects: Project[]
  activeProjectId: string
  setActiveProject: (id: string) => void
  createProject: (name: string, description: string, color: string, overview?: string) => Project
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color' | 'overview'>>) => void
  deleteProject: (id: string) => string  // returns new activeProjectId
  initProjects: (projects: Project[], activeId: string) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  activeProjectId: STX_PROJECT_ID,

  initProjects: (projects, activeId) => {
    set({ projects, activeProjectId: activeId })
  },

  setActiveProject: (id) => {
    saveActiveProjectId(id)
    set({ activeProjectId: id })
  },

  createProject: (name, description, color, overview) => {
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      color,
      overview: overview || '',
      createdAt: new Date().toISOString(),
    }
    const next = [...get().projects, project]
    saveProjects(next)
    set({ projects: next })
    return project
  },

  updateProject: (id, updates) => {
    const next = get().projects.map((p) => p.id === id ? { ...p, ...updates } : p)
    saveProjects(next)
    set({ projects: next })
  },

  deleteProject: (id) => {
    const { projects, activeProjectId } = get()
    const next = projects.filter((p) => p.id !== id)
    saveProjects(next)
    clearProjectData(id)
    if (isFirebaseConfigured()) {
      // Fire-and-forget — UI already updated locally
      void deleteProjectFromFirestore(id)
    }
    const newActiveId = activeProjectId === id
      ? (next[0]?.id ?? STX_PROJECT_ID)
      : activeProjectId
    saveActiveProjectId(newActiveId)
    set({ projects: next, activeProjectId: newActiveId })
    return newActiveId
  },
}))
