import { create } from 'zustand'
import type { Task } from '../types'

const SIDEBAR_KEY = 'stx-tracker:sidebar-collapsed'
const DASH_ORDER_KEY = 'stx-tracker:dashboard-order'
const DASH_HIDDEN_KEY = 'stx-tracker:dashboard-hidden'

export type DashWidgetKey = 'streak' | 'stats' | 'today' | 'progress-ring' | 'weekly-chart' | 'current-week'

export const DEFAULT_DASH_ORDER: DashWidgetKey[] = [
  'streak',
  'stats',
  'today',
  'progress-ring',
  'weekly-chart',
  'current-week',
]

function loadCollapsed(): boolean {
  try { return localStorage.getItem(SIDEBAR_KEY) === '1' } catch { return false }
}

function loadOrder(): DashWidgetKey[] {
  try {
    const raw = localStorage.getItem(DASH_ORDER_KEY)
    if (!raw) return DEFAULT_DASH_ORDER
    const parsed = JSON.parse(raw) as DashWidgetKey[]
    // Add any new widgets that aren't in the saved order yet
    const merged = [...parsed.filter((k) => DEFAULT_DASH_ORDER.includes(k))]
    for (const k of DEFAULT_DASH_ORDER) {
      if (!merged.includes(k)) merged.push(k)
    }
    return merged
  } catch {
    return DEFAULT_DASH_ORDER
  }
}

function loadHidden(): DashWidgetKey[] {
  try {
    const raw = localStorage.getItem(DASH_HIDDEN_KEY)
    return raw ? (JSON.parse(raw) as DashWidgetKey[]) : []
  } catch {
    return []
  }
}

interface UIStore {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void

  dashboardOrder: DashWidgetKey[]
  dashboardHidden: DashWidgetKey[]
  dashboardEditMode: boolean
  toggleDashboardEditMode: () => void
  moveDashboardWidget: (key: DashWidgetKey, direction: 'up' | 'down') => void
  toggleDashboardWidgetVisible: (key: DashWidgetKey) => void
  resetDashboardLayout: () => void

  pendingUndo: { tasks: Task[]; label: string; expiresAt: number; completionCount: number } | null
  pushUndo: (tasks: Task[], label: string, completionCount?: number) => void
  consumeUndo: () => { tasks: Task[]; completionCount: number } | null
  clearUndo: () => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarCollapsed: loadCollapsed(),
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed
    try { localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0') } catch { /* noop */ }
    set({ sidebarCollapsed: next })
  },
  setSidebarCollapsed: (v) => {
    try { localStorage.setItem(SIDEBAR_KEY, v ? '1' : '0') } catch { /* noop */ }
    set({ sidebarCollapsed: v })
  },

  dashboardOrder: loadOrder(),
  dashboardHidden: loadHidden(),
  dashboardEditMode: false,

  toggleDashboardEditMode: () => set({ dashboardEditMode: !get().dashboardEditMode }),

  moveDashboardWidget: (key, direction) => {
    const order = [...get().dashboardOrder]
    const idx = order.indexOf(key)
    if (idx === -1) return
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= order.length) return
    ;[order[idx], order[targetIdx]] = [order[targetIdx], order[idx]]
    try { localStorage.setItem(DASH_ORDER_KEY, JSON.stringify(order)) } catch { /* noop */ }
    set({ dashboardOrder: order })
  },

  toggleDashboardWidgetVisible: (key) => {
    const hidden = get().dashboardHidden
    const next = hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]
    try { localStorage.setItem(DASH_HIDDEN_KEY, JSON.stringify(next)) } catch { /* noop */ }
    set({ dashboardHidden: next })
  },

  resetDashboardLayout: () => {
    try {
      localStorage.removeItem(DASH_ORDER_KEY)
      localStorage.removeItem(DASH_HIDDEN_KEY)
    } catch { /* noop */ }
    set({ dashboardOrder: DEFAULT_DASH_ORDER, dashboardHidden: [] })
  },

  pendingUndo: null,
  pushUndo: (tasks, label, completionCount = 0) => {
    set({ pendingUndo: { tasks, label, expiresAt: Date.now() + 6000, completionCount } })
  },
  consumeUndo: () => {
    const u = get().pendingUndo
    if (!u) return null
    set({ pendingUndo: null })
    return { tasks: u.tasks, completionCount: u.completionCount }
  },
  clearUndo: () => set({ pendingUndo: null }),
}))
