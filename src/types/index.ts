export interface Project {
  id: string
  name: string
  description: string
  color: string   // 'indigo' | 'violet' | 'rose' | 'amber' | 'teal' | 'sky'
  overview?: string   // long-form markdown-ish notes for the project
  createdAt: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  estimatedMinutes: number
  dueDate: string            // ISO date "2026-04-27"
  dayLabel: string           // "Monday, April 27 — Setup & Baseline"
  weekNumber: number         // 1–N
  weekLabel: string          // "Week 1: April 27 – May 1, 2026"
  weekTheme: string          // "Deliverability Triage + Opt-In Diagnosis"
  status: 'todo' | 'done'
  completedAt: string | null
  notes: string
  isCustom: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastCompletionDate: string | null
  totalCompleted: number
}

export interface AppSettings {
  streakData: StreakData
  hideDone?: boolean
  collapsedWeeks?: number[]
}

export interface WeekSummary {
  weekNumber: number
  weekLabel: string
  weekTheme: string
  totalTasks: number
  doneTasks: number
  totalMinutes: number
  doneMinutes: number
}
