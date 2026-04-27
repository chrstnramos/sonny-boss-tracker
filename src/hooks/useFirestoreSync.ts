import { useEffect, useRef } from 'react'
import { isFirebaseConfigured } from '../lib/firebase'
import {
  saveTasksToFirestore,
  saveProjectsToFirestore,
  saveSettingsToFirestore,
  subscribeTasks,
  subscribeProjects,
  subscribeSettings,
} from '../storage/firestore'
import { saveTasks, saveProjects, saveSettings } from '../storage/adapter'
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

// Module-level write-suppression flag. When we apply a remote snapshot to a
// store, we set this true so the store's subscriber won't echo the same data
// back to Firestore as a "local" write. Cleared shortly after.
const remoteApplying = { current: false }
function withRemoteApply(fn: () => void) {
  remoteApplying.current = true
  try {
    fn()
  } finally {
    setTimeout(() => { remoteApplying.current = false }, 50)
  }
}

// Boot gate: writes are blocked until initApp finishes loading from Firestore.
// Without this, the seed-tasks-on-fresh-tab path would queue an 800ms-debounced
// write of default tasks, then the Firestore load would replace the store with
// the user's real tasks, and 800ms later the queued write would still fire and
// overwrite Firestore with seed tasks.
const bootGate = { ready: false }
export function markBootComplete() { bootGate.ready = true }

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

    // ─── Outgoing: local store changes → debounced Firestore writes ─────────
    const unsubTasks = useTaskStore.subscribe((state) => {
      if (!bootGate.ready) return
      if (remoteApplying.current) return
      if (!state.activeProjectId || !state.tasks.length) return
      debouncedTasks(state.tasks, state.activeProjectId)
    })

    const unsubProjects = useProjectStore.subscribe((state) => {
      if (!bootGate.ready) return
      if (remoteApplying.current) return
      if (!state.projects.length) return
      debouncedProjects(state.projects)
    })

    const unsubSettings = useSettingsStore.subscribe((state) => {
      if (!bootGate.ready) return
      if (remoteApplying.current) return
      if (!state.activeProjectId) return
      debouncedSettings(state.settings, state.activeProjectId)
    })

    // ─── Incoming: Firestore changes → local store updates (real-time) ──────
    let unsubRemoteTasks: (() => void) | null = null
    let unsubRemoteSettings: (() => void) | null = null
    let lastSubscribedProjectId: string | null = null

    const resubscribePerProject = () => {
      const pid = useProjectStore.getState().activeProjectId
      if (!pid || pid === lastSubscribedProjectId) return
      lastSubscribedProjectId = pid

      unsubRemoteTasks?.()
      unsubRemoteSettings?.()

      unsubRemoteTasks = subscribeTasks(pid, (tasks) => {
        const current = useTaskStore.getState()
        if (current.activeProjectId !== pid) return
        // Skip if identical to local (avoids redundant re-renders)
        if (JSON.stringify(current.tasks) === JSON.stringify(tasks)) return
        withRemoteApply(() => {
          saveTasks(tasks, pid)
          useTaskStore.setState({ tasks })
        })
      })

      unsubRemoteSettings = subscribeSettings(pid, (settings) => {
        const current = useSettingsStore.getState()
        if (current.activeProjectId !== pid) return
        if (JSON.stringify(current.settings) === JSON.stringify(settings)) return
        withRemoteApply(() => {
          saveSettings(settings, pid)
          useSettingsStore.setState({ settings })
        })
      })
    }

    const unsubRemoteProjects = subscribeProjects((projects) => {
      const current = useProjectStore.getState()
      if (JSON.stringify(current.projects) === JSON.stringify(projects)) return
      withRemoteApply(() => {
        saveProjects(projects)
        useProjectStore.setState({ projects })
      })
    })

    // Subscribe initially + whenever active project changes
    resubscribePerProject()
    const unsubProjectSwitch = useProjectStore.subscribe(() => {
      resubscribePerProject()
    })

    return () => {
      unsubTasks()
      unsubProjects()
      unsubSettings()
      unsubRemoteProjects()
      unsubRemoteTasks?.()
      unsubRemoteSettings?.()
      unsubProjectSwitch()
    }
  }, [setSyncing, setSynced, setError, setOffline, setIdle])
}
