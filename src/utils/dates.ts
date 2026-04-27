import { format, isToday, isBefore, startOfDay, parseISO } from 'date-fns'

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isOverdue(dueDate: string): boolean {
  return isBefore(startOfDay(parseISO(dueDate)), startOfDay(new Date()))
}

export function isDueToday(dueDate: string): boolean {
  return isToday(parseISO(dueDate))
}

export function fmtDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function fmtMinutes(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return h > 0 ? `${h}h ${min}m` : `${min}m`
}
