import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { TopBar } from '../components/layout/TopBar'
import { TaskRow } from '../components/timeline/TaskRow'
import { useTaskStore } from '../store/taskStore'
import { useTimeStats } from '../hooks/useTimeStats'
import { fmtDate, fmtMinutes, todayISO } from '../utils/dates'

export function TodayPage() {
  const tasks = useTaskStore((s) => s.tasks)
  const { todayTasks } = useTimeStats()
  const today = todayISO()

  const overdueTasks = useMemo(
    () => tasks.filter((t) => t.status === 'todo' && t.dueDate < today),
    [tasks, today]
  )

  const done = todayTasks.filter((t) => t.status === 'done').length
  const totalMin = todayTasks.reduce((s, t) => s + t.estimatedMinutes, 0)
  const allDone = todayTasks.length > 0 && done === todayTasks.length

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="Today"
        subtitle={fmtDate(today)}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="p-6 max-w-2xl mx-auto w-full space-y-6"
      >
        {allDone && todayTasks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">All done for today! 🎉</p>
              <p className="text-xs text-slate-500">Great work. Check the timeline for upcoming tasks.</p>
            </div>
            <Link to="/timeline" className="ml-auto text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 flex-shrink-0">
              Timeline <ArrowRight size={12} />
            </Link>
          </motion.div>
        )}

        {/* Today's tasks */}
        {todayTasks.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-accent-400" />
                <h2 className="text-sm font-semibold text-slate-200">
                  {fmtDate(today)} — {todayTasks[0]?.dayLabel}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{fmtMinutes(totalMin)}</span>
                <span className="font-semibold text-slate-300">{done}/{todayTasks.length}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              {todayTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Overdue tasks */}
        {overdueTasks.length > 0 && (
          <div>
            <p className="text-xs font-medium text-red-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Overdue — {overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} from previous days
            </p>
            <div className="card p-4 border-red-500/20 space-y-0.5">
              {overdueTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {todayTasks.length === 0 && overdueTasks.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <CheckCircle2 size={36} className="text-slate-600" />
            <p className="text-sm font-medium text-slate-400">Nothing scheduled for today</p>
            <p className="text-xs text-slate-600">You have no tasks due on {fmtDate(today)}</p>
            <Link to="/timeline" className="btn-secondary text-xs mt-2">
              View full timeline <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
