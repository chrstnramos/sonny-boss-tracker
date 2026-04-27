import { useState, useEffect } from 'react'
import { format, parseISO, getISOWeek, getISOWeekYear, startOfWeek, endOfWeek } from 'date-fns'
import { Modal } from '../ui/Modal'
import { useTaskStore } from '../../store/taskStore'
import type { Task } from '../../types'

interface TaskFormProps {
  open: boolean
  onClose: () => void
  editTask?: Task | null
  allTasks?: Task[]
  onAdded?: (weekNumber: number) => void
  defaultWeekNumber?: number
  defaultWeekLabel?: string
  defaultWeekTheme?: string
  defaultDueDate?: string
  defaultDayLabel?: string
}

interface DerivedMeta {
  weekNumber: number
  weekLabel: string
  weekTheme: string
  dayLabel: string
  isBrandNewWeek: boolean
  isBrandNewDay: boolean
}

function deriveWeekMeta(dueDate: string, allTasks: Task[]): DerivedMeta {
  const d = parseISO(dueDate)
  const toIsoKey = (date: Date) => `${getISOWeekYear(date)}-W${String(getISOWeek(date)).padStart(2, '0')}`
  const targetKey = toIsoKey(d)

  // Exact date match — borrow all metadata
  const sameDate = allTasks.find((t) => t.dueDate === dueDate)
  if (sameDate) {
    return { weekNumber: sameDate.weekNumber, weekLabel: sameDate.weekLabel, weekTheme: sameDate.weekTheme, dayLabel: sameDate.dayLabel, isBrandNewWeek: false, isBrandNewDay: false }
  }

  // Same ISO week — borrow week metadata, derive dayLabel
  const sameWeek = allTasks.find((t) => toIsoKey(parseISO(t.dueDate)) === targetKey)
  if (sameWeek) {
    const dayLabel = format(d, 'EEEE, MMMM d') + (sameWeek.weekTheme ? ` — ${sameWeek.weekTheme}` : '')
    return { weekNumber: sameWeek.weekNumber, weekLabel: sameWeek.weekLabel, weekTheme: sameWeek.weekTheme, dayLabel, isBrandNewWeek: false, isBrandNewDay: true }
  }

  // Brand-new week — determine sequential number by chronological position
  const mon = startOfWeek(d, { weekStartsOn: 1 })
  const sun = endOfWeek(d, { weekStartsOn: 1 })
  const existingKeys = [...new Set(allTasks.map((t) => toIsoKey(parseISO(t.dueDate))))].sort()
  const weeksBefore = existingKeys.filter((k) => k < targetKey).length
  const weekNumber = weeksBefore + 1
  const weekLabel = `Week ${weekNumber}: ${format(mon, 'MMM d')} – ${format(sun, 'MMM d, yyyy')}`
  return { weekNumber, weekLabel, weekTheme: '', dayLabel: format(d, 'EEEE, MMMM d'), isBrandNewWeek: true, isBrandNewDay: true }
}

export function TaskForm({ open, onClose, editTask, allTasks, onAdded, defaultWeekNumber = 1, defaultWeekLabel = '', defaultWeekTheme = '', defaultDueDate = '', defaultDayLabel = '' }: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore()
  const [title, setTitle] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState(30)
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [customWeekTheme, setCustomWeekTheme] = useState('')
  const [customDayLabel, setCustomDayLabel] = useState('')

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setEstimatedMinutes(editTask.estimatedMinutes)
      setDueDate(editTask.dueDate)
      setNotes(editTask.notes)
      setCustomWeekTheme('')
      setCustomDayLabel('')
    } else {
      setTitle('')
      setEstimatedMinutes(30)
      setDueDate(defaultDueDate)
      setNotes('')
      setCustomWeekTheme('')
      setCustomDayLabel('')
    }
  }, [editTask, open, defaultDueDate])

  // Derive meta preview to know if we should show theme/dayLabel fields
  const previewMeta = !editTask && dueDate
    ? deriveWeekMeta(dueDate, allTasks ?? [])
    : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (editTask) {
      let dateUpdates: Partial<Task> = {}
      if (dueDate !== editTask.dueDate && dueDate) {
        const otherTasks = (allTasks ?? []).filter((t) => t.id !== editTask.id)
        dateUpdates = deriveWeekMeta(dueDate, otherTasks)
      }
      updateTask(editTask.id, { title: title.trim(), estimatedMinutes, dueDate, notes, ...dateUpdates })
    } else {
      const meta = dueDate
        ? deriveWeekMeta(dueDate, allTasks ?? [])
        : { weekNumber: defaultWeekNumber, weekLabel: defaultWeekLabel, weekTheme: defaultWeekTheme, dayLabel: defaultDayLabel || dueDate, isBrandNewWeek: false, isBrandNewDay: false }
      // User-supplied overrides
      const finalWeekTheme = (meta.isBrandNewWeek && customWeekTheme.trim()) ? customWeekTheme.trim() : meta.weekTheme
      const finalDayLabel = (meta.isBrandNewDay && customDayLabel.trim()) ? customDayLabel.trim() : meta.dayLabel
      addTask({
        title: title.trim(),
        estimatedMinutes,
        dueDate,
        dayLabel: finalDayLabel,
        weekNumber: meta.weekNumber,
        weekLabel: meta.weekLabel,
        weekTheme: finalWeekTheme,
        status: 'todo',
        completedAt: null,
        notes,
        isCustom: true,
        order: 999,
        projectId: '',
      })
      onAdded?.(meta.weekNumber)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editTask ? 'Edit Task' : 'Add Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Task title *</label>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?" className="input-base" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Est. minutes</label>
            <input type="number" min={1} max={480} value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))} className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-base" />
          </div>
        </div>
        {previewMeta?.isBrandNewWeek && (
          <div className="rounded-lg border border-accent-500/20 bg-accent-500/5 p-3 space-y-3">
            <p className="text-xs text-accent-300 font-medium">
              New week detected — customize it upfront (optional):
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Week theme</label>
              <input
                type="text"
                value={customWeekTheme}
                onChange={(e) => setCustomWeekTheme(e.target.value)}
                placeholder={`e.g., "SMS Audit + Deliverability"`}
                className="input-base"
              />
              <p className="text-[10px] text-slate-500 mt-1">Auto-label: {previewMeta.weekLabel}</p>
            </div>
          </div>
        )}
        {previewMeta?.isBrandNewDay && !editTask && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Day label <span className="text-slate-600">(optional override)</span>
            </label>
            <input
              type="text"
              value={customDayLabel}
              onChange={(e) => setCustomDayLabel(e.target.value)}
              placeholder={previewMeta.dayLabel}
              className="input-base"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..." rows={2} className="input-base resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">{editTask ? 'Save Changes' : 'Add Task'}</button>
        </div>
      </form>
    </Modal>
  )
}
