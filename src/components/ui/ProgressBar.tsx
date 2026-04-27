interface ProgressBarProps {
  value: number   // 0–100
  color?: string
  height?: string
  showLabel?: boolean
}

export function ProgressBar({ value, color = 'bg-accent-500', height = 'h-1.5', showLabel = false }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${height} bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-700`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs tabular-nums text-slate-400 w-8 text-right">{value}%</span>
      )}
    </div>
  )
}
