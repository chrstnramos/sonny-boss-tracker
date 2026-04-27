import { useState, useRef, useEffect } from 'react'
import { AlertTriangle, Check, Clock } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useConfetti } from '../../hooks/useConfetti'
import { todayISO, fmtDate } from '../../utils/dates'
import type { Task } from '../../types'

interface OverdueCardProps {
  overdueCount: number
  overdueTasks: Task[]
}

export function OverdueCard({ overdueCount, overdueTasks }: OverdueCardProps) {
  const [open, setOpen] = useState(false)
  const { _toggleAndReturn } = useTaskStore()
  const { recordCompletion } = useSettingsStore()
  const { fire } = useConfetti()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Auto-close when all tasks resolved
  useEffect(() => {
    if (open && overdueCount === 0) setOpen(false)
  }, [overdueCount, open])

  const resolve = (task: Task) => {
    const { becameDone } = _toggleAndReturn(task.id)
    if (becameDone) {
      recordCompletion(todayISO())
      fire()
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => overdueCount > 0 && setOpen((v) => !v)}
        className={`card p-4 flex items-start justify-between gap-3 w-full text-left transition-colors ${
          overdueCount > 0 ? 'hover:border-red-500/30 cursor-pointer' : 'cursor-default'
        } ${open ? 'border-red-500/30' : ''}`}
      >
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Overdue</p>
          <p className="text-2xl font-bold text-slate-100 mt-1 tabular-nums leading-none">{overdueCount}</p>
          {overdueCount > 0 && (
            <p className="text-xs text-red-400/70 mt-0.5">{open ? 'Click to close' : 'Click to review'}</p>
          )}
        </div>
        <div className={`relative p-2.5 rounded-xl flex-shrink-0 ${overdueCount > 0 ? 'bg-red-500/15' : 'bg-slate-700'}`}>
          {overdueCount > 0 && (
            <span className="absolute inset-0 rounded-xl bg-red-500/15 animate-ping opacity-40" />
          )}
          <AlertTriangle size={18} className={overdueCount > 0 ? 'text-red-400' : 'text-slate-500'} />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-700/60">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">
              {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto py-1.5 space-y-0.5 px-1.5">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 leading-snug truncate">{task.title}</p>
                  <p className="flex items-center gap-1 text-xs text-red-400/70 mt-0.5">
                    <Clock size={10} />
                    Due {fmtDate(task.dueDate)}
                  </p>
                </div>
                <button
                  onClick={() => resolve(task)}
                  className="flex-shrink-0 flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <Check size={11} /> Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
