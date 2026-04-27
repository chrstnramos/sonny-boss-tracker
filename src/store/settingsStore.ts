import { create } from 'zustand'
import type { AppSettings } from '../types'
import { loadSettings, saveSettings } from '../storage/adapter'

const DEFAULT_SETTINGS: AppSettings = {
  streakData: { currentStreak: 0, longestStreak: 0, lastCompletionDate: null, totalCompleted: 0 },
  hideDone: false,
  collapsedWeeks: [],
}

interface SettingsStore {
  settings: AppSettings
  activeProjectId: string
  loadForProject: (projectId: string) => void
  recordCompletion: (todayDate: string, count?: number) => void
  undoCompletion: (count?: number) => void
  setHideDone: (v: boolean) => void
  setWeekCollapsed: (weekNumber: number, collapsed: boolean) => void
  setAllWeeksCollapsed: (weekNumbers: number[], collapsed: boolean) => void
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  activeProjectId: '',

  loadForProject: (projectId) => {
    set({ settings: loadSettings(projectId), activeProjectId: projectId })
  },

  recordCompletion: (todayDate, count = 1) => {
    if (count <= 0) return
    const { streakData } = get().settings
    const { activeProjectId } = get()
    const last = streakData.lastCompletionDate

    let currentStreak = streakData.currentStreak
    if (last === null) {
      currentStreak = 1
    } else if (last === todayDate) {
      // same day — just increment total, keep streak
    } else {
      const diffDays = Math.round(
        (new Date(todayDate).getTime() - new Date(last).getTime()) / 86_400_000
      )
      currentStreak = diffDays === 1 ? currentStreak + 1 : 1
    }

    const next: AppSettings = {
      ...get().settings,
      streakData: {
        currentStreak,
        longestStreak: Math.max(currentStreak, streakData.longestStreak),
        lastCompletionDate: todayDate,
        totalCompleted: streakData.totalCompleted + count,
      },
    }
    saveSettings(next, activeProjectId)
    set({ settings: next })
  },

  undoCompletion: (count = 1) => {
    if (count <= 0) return
    const { streakData } = get().settings
    const { activeProjectId } = get()
    const next: AppSettings = {
      ...get().settings,
      streakData: { ...streakData, totalCompleted: Math.max(0, streakData.totalCompleted - count) },
    }
    saveSettings(next, activeProjectId)
    set({ settings: next })
  },

  setHideDone: (v) => {
    const { activeProjectId } = get()
    const next: AppSettings = { ...get().settings, hideDone: v }
    saveSettings(next, activeProjectId)
    set({ settings: next })
  },

  setWeekCollapsed: (weekNumber, collapsed) => {
    const { activeProjectId, settings } = get()
    const current = settings.collapsedWeeks ?? []
    const nextCollapsed = collapsed
      ? (current.includes(weekNumber) ? current : [...current, weekNumber])
      : current.filter((n) => n !== weekNumber)
    const next: AppSettings = { ...settings, collapsedWeeks: nextCollapsed }
    saveSettings(next, activeProjectId)
    set({ settings: next })
  },

  setAllWeeksCollapsed: (weekNumbers, collapsed) => {
    const { activeProjectId, settings } = get()
    const next: AppSettings = {
      ...settings,
      collapsedWeeks: collapsed ? [...weekNumbers] : [],
    }
    saveSettings(next, activeProjectId)
    set({ settings: next })
  },
}))
