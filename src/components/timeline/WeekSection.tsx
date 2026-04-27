import { useState, useMemo, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Plus, CheckCheck, Trash2 } from 'lucide-react'
import { TaskRow } from './TaskRow'
import { TaskForm } from '../tasks/TaskForm'
import { EditableText } from '../common/EditableText'
import { fmtMinutes, todayISO } from '../../utils/dates'
import { useTaskStore } from '../../store/taskStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useUIStore } from '../../store/uiStore'
import { useConfetti } from '../../hooks/useConfetti'
import type { Task } from '../../types'

interface WeekSectionProps {
  weekNumber: number
  weekLabel: string
  weekTheme: string
  tasks: Task[]
  defaultExpanded?: boolean
  forceExpand?: boolean
  onTaskAdded?: (weekNumber: number) => void
}

export function WeekSection({ weekNumber, weekLabel, weekTheme, tasks, defaultExpanded = false, forceExpand, onTaskAdded }: WeekSectionProps) {
  const allTasks = useTaskStore((s) => s.tasks)
  const markAllDone = useTaskStore((s) => s.markAllDone)
  const updateWeekMeta = useTaskStore((s) => s.updateWeekMeta)
  const updateDayLabel = useTaskStore((s) => s.updateDayLabel)
  const deleteWeek = useTaskStore((s) => s.deleteWeek)
  const pushUndo = useUIStore((s) => s.pushUndo)
  const { recordCompletion, settings, setWeekCollapsed } = useSettingsStore()
  const { fire } = useConfetti()

  const collapsedList = settings.collapsedWeeks ?? []
  const isPersistCollapsed = collapsedList.includes(weekNumber)
  // Initial expansion: if collapse memory has any entries, derive from it; otherwise defaultExpanded
  const [hasInitialized, setHasInitialized] = useState(collapsedList.length > 0)
  const expanded = hasInitialized ? !isPersistCollapsed : defaultExpanded
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (forceExpand && isPersistCollapsed) {
      setWeekCollapsed(weekNumber, false)
      setHasInitialized(true)
    }
  }, [forceExpand, isPersistCollapsed, weekNumber, setWeekCollapsed])

  const handleToggleExpand = () => {
    setWeekCollapsed(weekNumber, expanded)
    setHasInitialized(true)
  }

  const doneTasks = tasks.filter((t) => t.status === 'done').length
  const totalTasks = tasks.length
  const doneMinutes = tasks.filter((t) => t.status === 'done').reduce((s, t) => s + t.estimatedMinutes, 0)
  const totalMinutes = tasks.reduce((s, t) => s + t.estimatedMinutes, 0)
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
  const isComplete = pct === 100

  const byDay = useMemo(() => {
    const map = new Map<string, { label: string; dueDate: string; tasks: Task[] }>()
    for (const t of tasks) {
      const key = t.dueDate
      if (!map.has(key)) map.set(key, { label: t.dayLabel, dueDate: t.dueDate, tasks: [] })
      map.get(key)!.tasks.push(t)
    }
    return Array.from(map.values()).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [tasks])

  const firstDueDate = tasks[0]?.dueDate ?? ''
  const firstDayLabel = tasks[0]?.dayLabel ?? ''

  const handleMarkAllDone = () => {
    const todoIds = allTasks
      .filter((t) => t.weekNumber === weekNumber && t.status === 'todo')
      .map((t) => t.id)
    if (!todoIds.length) return
    markAllDone(todoIds)
    recordCompletion(todayISO(), todoIds.length)
    fire()
  }

  const handleDeleteWeek = (e: MouseEvent) => {
    e.stopPropagation()
    const removed = deleteWeek(weekNumber)
    if (removed.length) {
      pushUndo(removed, `Deleted week ${weekNumber} (${removed.length} task${removed.length === 1 ? '' : 's'})`)
    }
  }

  return (
    <div className={`group/week rounded-xl border transition-colors ${
      isComplete
        ? 'border-emerald-500/20 bg-emerald-500/5'
        : expanded
          ? 'border-slate-700/60 bg-slate-900/60'
          : 'border-slate-700/40 bg-slate-900/30'
    }`}>
      {/* Header */}
      <div
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
        onClick={handleToggleExpand}
      >
        <ChevronRight
          size={16}
          className={`flex-shrink-0 text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-wide">
              Wk {weekNumber}
            </span>
            <EditableText
              as="span"
              value={weekLabel}
              onSave={(v) => updateWeekMeta(weekNumber, { weekLabel: v })}
              className="text-sm font-semibold text-slate-200"
              inputClassName="text-sm font-semibold text-slate-200 min-w-[20ch]"
            />
            {isComplete && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                Complete ✓
              </span>
            )}
          </div>
          <EditableText
            as="p"
            value={weekTheme}
            onSave={(v) => updateWeekMeta(weekNumber, { weekTheme: v })}
            emptyLabel="Add a theme…"
            className="text-xs text-slate-500 mt-0.5 truncate block"
            inputClassName="text-xs min-w-[30ch] w-full"
          />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-slate-500 hidden sm:block">
            {fmtMinutes(doneMinutes)} / {fmtMinutes(totalMinutes)}
          </span>
          <span className={`text-xs font-semibold tabular-nums ${isComplete ? 'text-emerald-400' : 'text-slate-400'}`}>
            {doneTasks}/{totalTasks}
          </span>
          <div className="w-20 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-accent-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <button
            onClick={handleDeleteWeek}
            className="opacity-0 group-hover/week:opacity-100 transition-opacity text-slate-500 hover:text-red-400 p-1"
            title="Delete entire week"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-slate-700/40 pt-3">
              {byDay.map(({ label, dueDate, tasks: dayTasks }) => (
                <div key={dueDate}>
                  <EditableText
                    as="p"
                    value={label}
                    onSave={(v) => updateDayLabel(weekNumber, dueDate, v)}
                    emptyLabel="Add a day label…"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-3 block"
                    inputClassName="text-xs font-semibold uppercase tracking-wider min-w-[24ch]"
                  />
                  <div className="space-y-0.5">
                    {dayTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onEdit={setEditTask} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Bottom actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-accent-400 transition-colors px-3 py-1.5"
                >
                  <Plus size={13} /> Add task to this week
                </button>
                {!isComplete && (
                  <button
                    onClick={handleMarkAllDone}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-400 transition-colors px-3 py-1.5 ml-auto"
                  >
                    <CheckCheck size={13} /> Mark all done
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forms */}
      <TaskForm
        open={!!editTask}
        onClose={() => setEditTask(null)}
        editTask={editTask}
        allTasks={allTasks}
      />
      <TaskForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdded={onTaskAdded}
        defaultWeekNumber={weekNumber}
        defaultWeekLabel={weekLabel}
        defaultWeekTheme={weekTheme}
        defaultDueDate={firstDueDate}
        defaultDayLabel={firstDayLabel}
        allTasks={allTasks}
      />
    </div>
  )
}
