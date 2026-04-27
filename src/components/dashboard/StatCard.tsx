import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  pulse?: boolean
  valueStr?: string   // if provided, skip number animation and show this
}

function AnimNum({ to }: { to: number }) {
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 80, damping: 18 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString())
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; mv.set(0) }
    mv.set(to)
  }, [to, mv])
  return <motion.span>{display}</motion.span>
}

export function StatCard({ label, value, suffix = '', icon: Icon, iconColor, iconBg, pulse = false, valueStr }: StatCardProps) {
  return (
    <div className="card p-4 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-100 mt-1 tabular-nums leading-none">
          {valueStr ? valueStr : <><AnimNum to={value} />{suffix}</>}
        </p>
      </div>
      <div className={`relative p-2.5 rounded-xl flex-shrink-0 ${iconBg}`}>
        {pulse && value > 0 && (
          <span className={`absolute inset-0 rounded-xl ${iconBg} animate-ping opacity-40`} />
        )}
        <Icon size={18} className={iconColor} />
      </div>
    </div>
  )
}
