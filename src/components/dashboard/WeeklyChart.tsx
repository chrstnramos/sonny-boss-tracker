import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTimeStats } from '../../hooks/useTimeStats'

export function WeeklyChart() {
  const { weeks } = useTimeStats()

  const data = weeks.map((w) => ({
    name: `W${w.weekNumber}`,
    done: w.done,
    total: w.total,
    pct: w.total > 0 ? Math.round((w.done / w.total) * 100) : 0,
    label: w.label,
  }))

  return (
    <div className="card p-5 flex-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">Weekly Progress</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={14} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 'dataMax']} />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#f1f5f9' }}
            cursor={{ fill: '#334155', radius: 4 }}
            formatter={((val: unknown, _name: unknown, props: any) => [
              `${val} / ${props.payload.total} tasks (${props.payload.pct}%)`,
              'Completed'
            ]) as any}
            labelFormatter={(label) => `Week ${label.replace('W', '')}`}
          />
          <Bar dataKey="done" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.pct === 100 ? '#34d399' : entry.done > 0 ? '#6366f1' : '#1e293b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
