import { Flame, Trophy, Star } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'

export function StreakWidget() {
  const streak = useSettingsStore((s) => s.settings.streakData)
  const { currentStreak, longestStreak, totalCompleted } = streak
  const hot = currentStreak >= 3

  return (
    <div className={`rounded-xl p-4 flex items-center justify-between gap-4 border ${
      hot
        ? 'bg-amber-500/10 border-amber-500/20'
        : currentStreak > 0
          ? 'bg-accent-500/10 border-accent-500/20'
          : 'card'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${hot ? 'bg-amber-500/20' : 'bg-slate-700'} ${hot ? 'animate-glow-amber' : ''}`}>
          <Flame size={20} className={hot ? 'text-amber-400' : currentStreak > 0 ? 'text-accent-400' : 'text-slate-500'} />
        </div>
        <div>
          <p className={`font-bold text-base ${hot ? 'text-amber-300' : currentStreak > 0 ? 'text-slate-100' : 'text-slate-400'}`}>
            {currentStreak > 0 ? `${currentStreak}-day streak!` : 'No streak yet'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentStreak > 0 ? 'Keep completing tasks daily to maintain it' : 'Complete a task today to start your streak'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Trophy size={12} className="text-slate-500" />
            <span className="text-base font-bold text-slate-200 tabular-nums">{longestStreak}</span>
          </div>
          <p className="text-xs text-slate-500">Best</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star size={12} className="text-slate-500" />
            <span className="text-base font-bold text-slate-200 tabular-nums">{totalCompleted}</span>
          </div>
          <p className="text-xs text-slate-500">Total</p>
        </div>
      </div>
    </div>
  )
}
