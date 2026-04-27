import { buildSeedTasks } from '../data/seedTasks'
import { isSeeded, markSeeded, saveTasks, saveSettings, loadProjects, saveProjects, loadActiveProjectId, saveActiveProjectId } from '../storage/adapter'
import { loadTasksFromFirestore, loadProjectsFromFirestore, loadSettingsFromFirestore } from '../storage/firestore'
import { useTaskStore } from '../store/taskStore'
import { useSettingsStore } from '../store/settingsStore'
import { useProjectStore, STX_PROJECT_ID } from '../store/projectStore'
import type { Project } from '../types'

const STX_PROJECT: Project = {
  id: STX_PROJECT_ID,
  name: 'STX Promo 90-Day Plan',
  description: "Sonny's 90-day email & marketing execution plan",
  color: 'indigo',
  createdAt: '2026-04-24T00:00:00.000Z',
}

export async function initApp() {
  // ── 1. Ensure STX project exists ──
  let projects = loadProjects()
  if (!projects.find((p) => p.id === STX_PROJECT_ID)) {
    projects = [STX_PROJECT, ...projects]
    saveProjects(projects)
  }

  // ── 2. Resolve active project ──
  const savedActiveId = loadActiveProjectId()
  const activeId = projects.find((p) => p.id === savedActiveId)
    ? savedActiveId!
    : STX_PROJECT_ID
  saveActiveProjectId(activeId)

  // ── 3. Init project store from localStorage (instant, no flash) ──
  useProjectStore.getState().initProjects(projects, activeId)

  // ── 4. Seed STX tasks if not yet seeded ──
  if (!isSeeded(STX_PROJECT_ID)) {
    const tasks = buildSeedTasks(STX_PROJECT_ID)
    saveTasks(tasks, STX_PROJECT_ID)
    markSeeded(STX_PROJECT_ID)
  }

  // ── 5. Load tasks + settings for active project from localStorage ──
  useTaskStore.getState().loadForProject(activeId)
  useSettingsStore.getState().loadForProject(activeId)

  // ── 6. Async: try to hydrate from Firestore (source of truth) ──
  try {
    const [firestoreProjects, firestoreTasks, firestoreSettings] = await Promise.all([
      loadProjectsFromFirestore(),
      loadTasksFromFirestore(activeId),
      loadSettingsFromFirestore(activeId),
    ])

    if (firestoreProjects) {
      saveProjects(firestoreProjects)
      useProjectStore.getState().initProjects(firestoreProjects, activeId)
    }

    if (firestoreTasks) {
      saveTasks(firestoreTasks, activeId)
      useTaskStore.getState().loadForProject(activeId)
    }

    if (firestoreSettings) {
      saveSettings(firestoreSettings, activeId)
      useSettingsStore.getState().loadForProject(activeId)
    }
  } catch {
    // Firestore unavailable — localStorage data already loaded above
  }
}
