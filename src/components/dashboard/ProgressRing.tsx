interface ProgressRingProps {
  pct: number
  doneTasks: number
  totalTasks: number
  doneMin: number
  totalMin: number
}

const R = 70
const CIRC = 2 * Math.PI * R

export function ProgressRing({ pct, doneTasks, totalTasks, doneMin, totalMin }: ProgressRingProps) {
  const offset = CIRC - (pct / 100) * CIRC
  const isComplete = pct === 100
  const strokeColor = isComplete ? '#34d399' : '#6366f1'

  const fmtMin = (m: number) => {
    const h = Math.floor(m / 60)
    const min = m % 60
    return h > 0 ? `${h}h ${min}m` : `${min}m`
  }

  return (
    <div className="card p-5 flex flex-col items-center">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide self-start mb-4">Overall Progress</p>

      <div className="relative">
        <svg width="176" height="176" viewBox="0 0 176 176">
          {/* Track */}
          <circle cx="88" cy="88" r={R} fill="none" stroke="#334155" strokeWidth="14" />
          {/* Progress arc */}
          <circle
            cx="88" cy="88" r={R}
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 88 88)"
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
          />
          {/* Glow layer at 0% hide, else show faint glow */}
          {pct > 0 && (
            <circle
              cx="88" cy="88" r={R}
              fill="none"
              stroke={strokeColor}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              transform="rotate(-90 88 88)"
              opacity="0.12"
            />
          )}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-100 tabular-nums">{pct}%</span>
          <span className="text-xs text-slate-500 mt-0.5">{doneTasks}/{totalTasks} tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-base font-bold text-emerald-400 tabular-nums">{fmtMin(doneMin)}</p>
          <p className="text-xs text-slate-500">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-slate-400 tabular-nums">{fmtMin(totalMin - doneMin)}</p>
          <p className="text-xs text-slate-500">Remaining</p>
        </div>
      </div>
    </div>
  )
}
