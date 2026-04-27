import { useState } from 'react'
import { Reorder, motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Clock, Eye, EyeOff, Pencil, Check, RotateCcw, GripVertical } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { StatCard } from '../components/dashboard/StatCard'
import { OverdueCard } from '../components/dashboard/OverdueCard'
import { ProgressRing } from '../components/dashboard/ProgressRing'
import { WeeklyChart } from '../components/dashboard/WeeklyChart'
import { StreakWidget } from '../components/dashboard/StreakWidget'
import { TodayPanel } from '../components/dashboard/TodayPanel'
import { useTimeStats } from '../hooks/useTimeStats'
import { useProjectStore } from '../store/projectStore'
import { useUIStore, DEFAULT_DASH_ORDER } from '../store/uiStore'
import type { DashWidgetKey } from '../store/uiStore'
import { fmtMinutes } from '../utils/dates'

const WIDGET_LABELS: Record<DashWidgetKey, string> = {
  streak: 'Streak banner',
  stats: 'Stat cards',
  today: 'Today',
  'progress-ring': 'Completion rate',
  'weekly-chart': 'Weekly chart',
  'current-week': 'Current week',
}

export function Dashboard() {
  const { totalTasks, doneTasks, pct, doneMinutes, totalMinutes, overdueCount, overdueTasks, weeks } = useTimeStats()
  const { projects, activeProjectId } = useProjectStore()
  const activeProject = projects.find((p) => p.id === activeProjectId)
  const {
    dashboardOrder,
    dashboardHidden,
    dashboardEditMode,
    toggleDashboardEditMode,
    toggleDashboardWidgetVisible,
    resetDashboardLayout,
  } = useUIStore()

  // Local optimistic order for smooth drag (commit to store on drag end)
  const [localOrder, setLocalOrder] = useState<DashWidgetKey[] | null>(null)
  const order = localOrder ?? dashboardOrder

  const currentWeek = weeks.find((w) => w.done < w.total) ?? weeks[weeks.length - 1]
  const visibleOrder = order.filter((k) => !dashboardHidden.includes(k))

  const handleReorder = (next: DashWidgetKey[]) => {
    setLocalOrder(next)
  }

  const handleDragEnd = () => {
    if (!localOrder) return
    // Merge local visible order back with hidden widgets in their relative positions
    const hiddenSet = new Set(dashboardHidden)
    const merged: DashWidgetKey[] = []
    let visIdx = 0
    for (const k of dashboardOrder) {
      if (hiddenSet.has(k)) {
        merged.push(k)
      } else {
        merged.push(localOrder[visIdx++])
      }
    }
    // Push to store via direct mutation pattern (replace order)
    try {
      localStorage.setItem('stx-tracker:dashboard-order', JSON.stringify(merged))
    } catch { /* noop */ }
    useUIStore.setState({ dashboardOrder: merged })
    setLocalOrder(null)
  }

  const renderWidget = (key: DashWidgetKey) => {
    switch (key) {
      case 'streak':
        return <StreakWidget />
      case 'stats':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Tasks Complete" value={doneTasks} suffix={`/${totalTasks}`} icon={CheckSquare}
              iconColor="text-accent-400" iconBg="bg-accent-500/15" />
            <StatCard label="Time Done" value={doneMinutes} icon={Clock}
              iconColor="text-emerald-400" iconBg="bg-emerald-500/15" valueStr={fmtMinutes(doneMinutes)} />
            <StatCard label="Time Left" value={totalMinutes - doneMinutes} icon={Clock}
              iconColor="text-slate-400" iconBg="bg-slate-700" valueStr={fmtMinutes(totalMinutes - doneMinutes)} />
            <OverdueCard overdueCount={overdueCount} overdueTasks={overdueTasks} />
          </div>
        )
      case 'today':
        return <TodayPanel />
      case 'progress-ring':
        return (
          <ProgressRing
            pct={pct}
            doneTasks={doneTasks}
            totalTasks={totalTasks}
            doneMin={doneMinutes}
            totalMin={totalMinutes}
          />
        )
      case 'weekly-chart':
        return <WeeklyChart />
      case 'current-week':
        if (!currentWeek) return null
        return (
          <div className="card p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Current Week</p>
            <p className="text-sm font-semibold text-slate-200">{currentWeek.label}</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-3">{currentWeek.theme}</p>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>{currentWeek.done}/{currentWeek.total} tasks</span>
              <span>{fmtMinutes(currentWeek.doneMin)} / {fmtMinutes(currentWeek.totalMin)}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-accent-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentWeek.total > 0 ? Math.round((currentWeek.done / currentWeek.total) * 100) : 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="Command Center"
        subtitle={activeProject?.name ?? 'Select a project'}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {dashboardEditMode && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  onClick={resetDashboardLayout}
                  className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
                  title="Reset to default layout"
                >
                  <RotateCcw size={13} /> Reset
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={toggleDashboardEditMode}
              className={`btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5 ${dashboardEditMode ? 'text-accent-400' : ''}`}
              title="Customize dashboard layout"
            >
              {dashboardEditMode ? <><Check size={13} /> Done</> : <><Pencil size={13} /> Customize</>}
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-4 max-w-5xl mx-auto w-full">
        <AnimatePresence>
          {dashboardEditMode && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-accent-500/30 bg-accent-500/5 p-3 flex items-start gap-2.5"
            >
              <Pencil size={14} className="text-accent-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-300 flex-1">
                <p className="font-medium text-accent-300">Customize mode</p>
                <p className="text-slate-400 mt-0.5">
                  Drag any widget by its handle to reorder. Use the eye icon to hide a widget.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {dashboardEditMode ? (
          <Reorder.Group
            axis="y"
            values={visibleOrder}
            onReorder={handleReorder}
            className="space-y-4"
          >
            {visibleOrder.map((key) => {
              const content = renderWidget(key)
              if (!content) return null
              return (
                <Reorder.Item
                  key={key}
                  value={key}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.01, boxShadow: '0 12px 32px rgba(0,0,0,0.45)', cursor: 'grabbing' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  className="relative ring-1 ring-slate-700/60 rounded-xl bg-slate-950/40"
                >
                  {/* Drag handle + controls */}
                  <div className="absolute -top-2.5 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg pl-1 pr-2 py-0.5 flex items-center gap-1 cursor-grab active:cursor-grabbing pointer-events-auto"
                      title="Drag to reorder">
                      <GripVertical size={13} className="text-slate-500" />
                      <span className="text-[10px] font-medium text-slate-400">{WIDGET_LABELS[key]}</span>
                    </div>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => toggleDashboardWidgetVisible(key)}
                      className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg px-2 py-1 text-slate-400 hover:text-red-400 transition-colors pointer-events-auto"
                      title="Hide widget"
                    >
                      <EyeOff size={12} />
                    </button>
                  </div>
                  {content}
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        ) : (
          <motion.div className="space-y-4" layout>
            <AnimatePresence mode="popLayout">
              {visibleOrder.map((key) => {
                const content = renderWidget(key)
                if (!content) return null
                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    {content}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {dashboardEditMode && dashboardHidden.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="card p-4"
            >
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Hidden widgets</p>
              <div className="flex flex-wrap gap-2">
                {dashboardHidden.map((k) => (
                  <button
                    key={k}
                    onClick={() => toggleDashboardWidgetVisible(k)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-accent-500/40 text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Eye size={11} /> {WIDGET_LABELS[k]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Suppress unused warning — DEFAULT_DASH_ORDER is used elsewhere
void DEFAULT_DASH_ORDER
