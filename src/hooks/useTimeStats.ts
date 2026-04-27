import { useMemo } from 'react'
import { useTaskStore } from '../store/taskStore'

export function useTimeStats() {
  const tasks = useTaskStore((s) => s.tasks)

  return useMemo(() => {
    const totalMinutes = tasks.reduce((s, t) => s + t.estimatedMinutes, 0)
    const doneMinutes = tasks.filter((t) => t.status === 'done').reduce((s, t) => s + t.estimatedMinutes, 0)
    const remainingMinutes = totalMinutes - doneMinutes

    const fmt = (m: number) => {
      const h = Math.floor(m / 60)
      const min = m % 60
      return h > 0 ? `${h}h ${min}m` : `${min}m`
    }

    const totalTasks = tasks.length
    const doneTasks = tasks.filter((t) => t.status === 'done').length
    const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

    const todayStr = new Date().toISOString().slice(0, 10)
    const overdueTasks = tasks.filter((t) => t.status === 'todo' && t.dueDate < todayStr)
    const overdueCount = overdueTasks.length
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr)

    // Week stats grouped
    const weekMap = new Map<number, { total: number; done: number; totalMin: number; doneMin: number; label: string; theme: string }>()
    for (const t of tasks) {
      if (!weekMap.has(t.weekNumber)) {
        weekMap.set(t.weekNumber, { total: 0, done: 0, totalMin: 0, doneMin: 0, label: t.weekLabel, theme: t.weekTheme })
      }
      const w = weekMap.get(t.weekNumber)!
      w.total++
      w.totalMin += t.estimatedMinutes
      if (t.status === 'done') { w.done++; w.doneMin += t.estimatedMinutes }
    }

    const weeks = Array.from(weekMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([weekNumber, v]) => ({ weekNumber, ...v }))

    return { totalMinutes, doneMinutes, remainingMinutes, fmt, totalTasks, doneTasks, pct, overdueCount, overdueTasks, todayTasks, weeks }
  }, [tasks])
}
