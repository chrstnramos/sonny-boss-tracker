import type { Task, AppSettings, Project } from '../types'

const K = {
  projects:      'stx-tracker:projects',
  activeProject: 'stx-tracker:active-project',
  tasks:         (pid: string) => `stx-tracker:tasks:${pid}`,
  settings:      (pid: string) => `stx-tracker:settings:${pid}`,
  seeded:        (pid: string) => `stx-tracker:seeded:${pid}`,
}

const SEED_VERSION = 'v2'

// ─── Projects ─────────────────────────────────────────────────────────────────

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(K.projects)
    return raw ? (JSON.parse(raw) as Project[]) : []
  } catch { return [] }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(K.projects, JSON.stringify(projects))
}

export function loadActiveProjectId(): string | null {
  return localStorage.getItem(K.activeProject)
}

export function saveActiveProjectId(id: string): void {
  localStorage.setItem(K.activeProject, id)
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function loadTasks(projectId: string): Task[] {
  try {
    const raw = localStorage.getItem(K.tasks(projectId))
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch { return [] }
}

export function saveTasks(tasks: Task[], projectId: string): void {
  localStorage.setItem(K.tasks(projectId), JSON.stringify(tasks))
}

// ─── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    totalCompleted: 0,
  },
}

export function loadSettings(projectId: string): AppSettings {
  try {
    const raw = localStorage.getItem(K.settings(projectId))
    return raw ? (JSON.parse(raw) as AppSettings) : DEFAULT_SETTINGS
  } catch { return DEFAULT_SETTINGS }
}

export function saveSettings(settings: AppSettings, projectId: string): void {
  localStorage.setItem(K.settings(projectId), JSON.stringify(settings))
}

// ─── Seeding flag ─────────────────────────────────────────────────────────────

export function isSeeded(projectId: string): boolean {
  return localStorage.getItem(K.seeded(projectId)) === SEED_VERSION
}

export function markSeeded(projectId: string): void {
  localStorage.setItem(K.seeded(projectId), SEED_VERSION)
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export function clearProjectData(projectId: string): void {
  try {
    localStorage.removeItem(K.tasks(projectId))
    localStorage.removeItem(K.settings(projectId))
    localStorage.removeItem(K.seeded(projectId))
  } catch { /* noop */ }
}
