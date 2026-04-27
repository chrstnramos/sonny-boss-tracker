import { db } from '../lib/firebase'
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import type { Task, Project, AppSettings } from '../types'

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  if (!db) return
  await Promise.all([
    deleteDoc(doc(db, 'tasks', projectId)).catch(() => { /* noop */ }),
    deleteDoc(doc(db, 'settings', projectId)).catch(() => { /* noop */ }),
  ])
}

export async function saveTasksToFirestore(tasks: Task[], projectId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'tasks', projectId), { items: tasks, updatedAt: new Date().toISOString() })
}

export async function loadTasksFromFirestore(projectId: string): Promise<Task[] | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'tasks', projectId))
  return snap.exists() ? (snap.data().items as Task[]) : null
}

export async function saveProjectsToFirestore(projects: Project[]): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'meta', 'projects'), { items: projects, updatedAt: new Date().toISOString() })
}

export async function loadProjectsFromFirestore(): Promise<Project[] | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'meta', 'projects'))
  return snap.exists() ? (snap.data().items as Project[]) : null
}

export async function saveSettingsToFirestore(settings: AppSettings, projectId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'settings', projectId), { ...settings, updatedAt: new Date().toISOString() })
}

export async function loadSettingsFromFirestore(projectId: string): Promise<AppSettings | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'settings', projectId))
  if (!snap.exists()) return null
  const { updatedAt: _u, ...settings } = snap.data()
  return settings as AppSettings
}

// ─── Live subscriptions (real-time cross-device sync) ───────────────────────

export function subscribeTasks(projectId: string, cb: (tasks: Task[]) => void): Unsubscribe {
  if (!db) return () => { /* noop */ }
  return onSnapshot(doc(db, 'tasks', projectId), (snap) => {
    if (!snap.exists()) return
    const data = snap.data()
    if (Array.isArray(data.items)) cb(data.items as Task[])
  })
}

export function subscribeProjects(cb: (projects: Project[]) => void): Unsubscribe {
  if (!db) return () => { /* noop */ }
  return onSnapshot(doc(db, 'meta', 'projects'), (snap) => {
    if (!snap.exists()) return
    const data = snap.data()
    if (Array.isArray(data.items)) cb(data.items as Project[])
  })
}

export function subscribeSettings(projectId: string, cb: (settings: AppSettings) => void): Unsubscribe {
  if (!db) return () => { /* noop */ }
  return onSnapshot(doc(db, 'settings', projectId), (snap) => {
    if (!snap.exists()) return
    const { updatedAt: _u, ...settings } = snap.data()
    cb(settings as AppSettings)
  })
}
