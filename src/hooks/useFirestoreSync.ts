import { useEffect, useRef } from 'react'
import { isFirebaseConfigured } from '../lib/firebase'
import { saveTasksToFirestore, saveProjectsToFirestore, saveSettingsToFirestore } from '../storage/firestore'
import { useTaskStore } from '../store/taskStore'
import { useProjectStore } from '../store/projectStore'
import { useSettingsStore } from '../store/settingsStore'
import { useSyncStore } from '../store/syncStore'

function makeDebounced(fn: (...args: unknown[]) => Promise<void>, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: unknown[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function useFirestoreSync() {
  const { setSyncing, setSynced, setError, setOffline, setIdle } = useSyncStore()
  const configuredRef = useRef(isFirebaseConfigured())

  useEffect(() => {
    if (!configuredRef.current) {
      setIdle()
      return
    }

    const wrap = async (fn: () => Promise<void>) => {
      setSyncing()
      try {
        await fn()
        setSynced()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        if (msg.includes('offline') || msg.includes('network') || msg.includes('unavailable')) {
          setOffline()
        } else {
          setError(msg)
        }
      }
    }

    const debouncedTasks = makeDebounced(
      async (...args) => {
        const [tasks, projectId] = args as Parameters<typeof saveTasksToFirestore>
        await wrap(() => saveTasksToFirestore(tasks, projectId))
      },
      800
    )

    const debouncedProjects = makeDebounced(
      async (...args) => {
        const [projects] = args as Parameters<typeof saveProjectsToFirestore>
        await wrap(() => saveProjectsToFirestore(projects))
      },
      800
    )

    const debouncedSettings = makeDebounced(
      async (...args) => {
        const [settings, projectId] = args as Parameters<typeof saveSettingsToFirestore>
        await wrap(() => saveSettingsToFirestore(settings, projectId))
      },
      800
    )

    const unsubTasks = useTaskStore.subscribe((state) => {
      if (!state.activeProjectId || !state.tasks.length) return
      debouncedTasks(state.tasks, state.activeProjectId)
    })

    const unsubProjects = useProjectStore.subscribe((state) => {
      if (!state.projects.length) return
      debouncedProjects(state.projects)
    })

    const unsubSettings = useSettingsStore.subscribe((state) => {
      if (!state.activeProjectId) return
      debouncedSettings(state.settings, state.activeProjectId)
    })

    return () => {
      unsubTasks()
      unsubProjects()
      unsubSettings()
    }
  }, [setSyncing, setSynced, setError, setOffline, setIdle])
}
