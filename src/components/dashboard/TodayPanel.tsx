import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react'
import { TaskRow } from '../timeline/TaskRow'
import { useTimeStats } from '../../hooks/useTimeStats'
import { fmtMinutes, todayISO } from '../../utils/dates'
import { useTaskStore } from '../../store/taskStore'
import { useMemo } from 'react'

export function TodayPanel() {
  const { todayTasks } = useTimeStats()
  const tasks = useTaskStore((s) => s.tasks)
  const today = todayISO()

  const overdueTasks = useMemo(
    () => tasks.filter((t) => t.status === 'todo' && t.dueDate < today),
    [tasks, today]
  )

  const doneTodayCount = todayTasks.filter((t) => t.status === 'done').length
  const totalTodayMin = todayTasks.reduce((s, t) => s + t.estimatedMinutes, 0)

  if (todayTasks.length === 0 && overdueTasks.length === 0) {
    return (
      <div className="card p-5">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">Today</p>
        <div className="flex flex-col items-center py-6 gap-2 text-center">
          <CheckCircle2 size={28} className="text-emerald-400" />
          <p className="text-sm font-medium text-slate-300">You're all caught up!</p>
          <p className="text-xs text-slate-500">No tasks scheduled for today.</p>
          <Link to="/timeline" className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1 mt-1">
            View timeline <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Today</p>
        <div className="flex items-center gap-2">
          {totalTodayMin > 0 && <span className="text-xs text-slate-500">{fmtMinutes(totalTodayMin)} total</span>}
          <span className="text-xs font-semibold text-slate-300">{doneTodayCount}/{todayTasks.length}</span>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-300">
            <span className="font-semibold">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}</span>
            {' '}from previous days
          </p>
          <Link to="/timeline" className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1 flex-shrink-0">
            View <ArrowRight size={11} />
          </Link>
        </div>
      )}

      <div className="space-y-0.5">
        {todayTasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
