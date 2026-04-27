import { create } from 'zustand'
import type { Task } from '../types'
import { loadTasks, saveTasks } from '../storage/adapter'

interface TaskStore {
  tasks: Task[]
  activeProjectId: string
  loadForProject: (projectId: string) => void
  toggleTask: (id: string) => void
  updateNotes: (id: string, notes: string) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  deleteWeek: (weekNumber: number) => Task[]
  addRawTasks: (tasks: Task[]) => void
  setTasks: (tasks: Task[]) => void
  markAllDone: (ids: string[]) => void
  updateWeekMeta: (weekNumber: number, updates: { weekLabel?: string; weekTheme?: string }) => void
  updateDayLabel: (weekNumber: number, dueDate: string, newLabel: string) => void
  _toggleAndReturn: (id: string) => { becameDone: boolean }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  activeProjectId: '',

  loadForProject: (projectId) => {
    set({ tasks: loadTasks(projectId), activeProjectId: projectId })
  },

  toggleTask: (id) => {
    get()._toggleAndReturn(id)
  },

  _toggleAndReturn: (id) => {
    const { tasks, activeProjectId } = get()
    const task = tasks.find((t) => t.id === id)
    if (!task) return { becameDone: false }

    const becameDone = task.status !== 'done'
    const now = new Date().toISOString()
    const next = tasks.map((t) =>
      t.id === id
        ? { ...t, status: becameDone ? ('done' as const) : ('todo' as const), completedAt: becameDone ? now : null, updatedAt: now }
        : t
    )
    saveTasks(next, activeProjectId)
    set({ tasks: next })
    return { becameDone }
  },

  updateNotes: (id, notes) => {
    const { tasks, activeProjectId } = get()
    const next = tasks.map((t) =>
      t.id === id ? { ...t, notes, updatedAt: new Date().toISOString() } : t
    )
    saveTasks(next, activeProjectId)
    set({ tasks: next })
  },

  addTask: (taskData) => {
    const { tasks, activeProjectId } = get()
    const task: Task = {
      ...taskData,
      projectId: activeProjectId,  // always stamp active project
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const next = [...tasks, task]
    saveTasks(next, activeProjectId)
    set({ tasks: next })
  },

  updateTask: (id, updates) => {
    const { tasks, activeProjectId } = get()
    const next = tasks.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    )
    saveTasks(next, activeProjectId)
    set({ tasks: next })
  },

  deleteTask: (id) => {
    const { tasks, activeProjectId } = get()
    const next = tasks.filter((t) => t.id !== id)
    saveTasks(next, activeProjectId)
    set({ tasks: next })
  },

  deleteWeek: (weekNumber) => {
    const { tasks, activeProjectId } = get()
    const removed = tasks.filter((t) => t.weekNumber === weekNumber)
    const next = tasks.filter((t) => t.weekNumber !== weekNumber)
    saveTasks(next, activeProjectId)
    set({ tasks: next })
    return removed
  },

  addRawTasks: (toAdd) => {
    const { tasks, activeProjectId } = get()
    const existing = new Set(tasks.map((t) => t.id))
    const merged = [...tasks, ...toAdd.filter((t) => !existing.has(t.id))]
    saveTasks(merged, activeProjectId)
    set({ tasks: merged })
  },

  setTasks: (tasks) => {
    const { activeProjectId } = get()
    saveTasks(tasks, activeProjectId)
    set({ tasks })
  },

  updateWeekMeta: (weekNumber, updates) => {
    const { tasks, activeProjectId } = get()
    const now = new Date().toISOString()
    const next = tasks.map((t) =>
      t.weekNumber === weekNumber ? { ...t, ...updates, updatedAt: now } : t
    )
    saveTasks(next, activeProjectId)
    set({ tasks: next })
  },

  updateDayLabel: (weekNumber, dueDate, newLabel) => {
    const { tasks, activeProjectId } = get()
    const now = new Date().toISOString()
    const next = tasks.map((t) =>
      t.weekNumber === weekNumber && t.dueDate === dueDate
        ? { ...t, dayLabel: newLabel, updatedAt: now }
        : t
    )
    saveTasks(next, activeProjectId)
    set({ tasks: next })
  },

  markAllDone: (ids) => {
    const { tasks, activeProjectId } = get()
    const now = new Date().toISOString()
    const next = tasks.map((t) =>
      ids.includes(t.id)
        ? { ...t, status: 'done' as const, completedAt: now, updatedAt: now }
        : t
    )
    saveTasks(next, activeProjectId)
    set({ tasks: next })
  },
}))
