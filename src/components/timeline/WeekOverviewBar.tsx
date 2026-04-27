import { useState } from 'react'
import type { Task } from '../../types'

interface WeekData {
  weekLabel: string
  weekTheme: string
  tasks: Task[]
}

interface WeekOverviewBarProps {
  weekGroups: [number, WeekData][]
  currentWeekNumber: number
  focusWeek: number | null
  onJumpTo: (weekNumber: number) => void
}

export function WeekOverviewBar({ weekGroups, currentWeekNumber, focusWeek, onJumpTo }: WeekOverviewBarProps) {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  if (weekGroups.length === 0) return null

  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">All Weeks</p>
      <div className="flex gap-1 h-10 rounded-xl overflow-hidden">
        {weekGroups.map(([weekNumber, { weekLabel, weekTheme, tasks }]) => {
          const total = tasks.length
          const done = tasks.filter((t) => t.status === 'done').length
          const pct = total > 0 ? Math.round((done / total) * 100) : 0
          const isComplete = pct === 100
          const isCurrent = weekNumber === currentWeekNumber
          const isFocused = weekNumber === focusWeek
          const isHovered = weekNumber === hoveredWeek

          return (
            <div
              key={weekNumber}
              className="relative flex-1 min-w-0 cursor-pointer rounded-lg overflow-hidden"
              onClick={() => onJumpTo(weekNumber)}
              onMouseEnter={() => setHoveredWeek(weekNumber)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              {/* Background base */}
              <div className="absolute inset-0 bg-slate-700/60" />

              {/* Completion fill */}
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                  isComplete ? 'bg-emerald-500/60' : 'bg-accent-500/50'
                }`}
                style={{ width: `${pct}%` }}
              />

              {/* Current week ring */}
              {isCurrent && (
                <div className="absolute inset-0 ring-2 ring-white/30 ring-inset rounded-lg pointer-events-none" />
              )}
              {isFocused && (
                <div className="absolute inset-0 ring-2 ring-accent-400/60 ring-inset rounded-lg pointer-events-none" />
              )}

              {/* Label */}
              <div className="relative h-full flex flex-col items-center justify-center px-1">
                <span className={`text-xs font-bold leading-none tabular-nums ${
                  isComplete ? 'text-emerald-300' : isCurrent ? 'text-white' : 'text-slate-300'
                }`}>
                  {isComplete ? '✓' : `W${weekNumber}`}
                </span>
                {total > 0 && (
                  <span className="text-[9px] text-slate-400 mt-0.5 tabular-nums">{pct}%</span>
                )}
              </div>

              {/* Hover tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                  <div className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap">
                    <p className="text-xs font-semibold text-slate-200">{weekLabel}</p>
                    {weekTheme && <p className="text-xs text-slate-400 truncate max-w-[180px]">{weekTheme}</p>}
                    <p className="text-xs text-slate-400 mt-0.5">{done}/{total} tasks · {pct}%</p>
                  </div>
                  <div className="w-2 h-2 bg-slate-800 border-r border-b border-slate-600 rotate-45 mx-auto -mt-1" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
