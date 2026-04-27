import { format, parseISO, startOfWeek, endOfWeek, getISOWeek, getISOWeekYear } from 'date-fns'
import type { Task } from '../types'

export interface CsvRow {
  title: string
  dueDate: string
  estimatedMinutes: number
  weekLabel: string
  weekTheme: string
  dayLabel: string
  notes: string
  status: 'todo' | 'done'
  order: number | null
  _rowIndex: number
}

export interface CsvParseResult {
  rows: CsvRow[]
  errors: string[]
}

// Parse duration strings: "25", "1h", "1h30m", "1h 30m", "90m"
function parseMinutesStr(raw: string): number | null {
  const s = raw.trim().toLowerCase()
  if (!s) return null
  if (/^\d+$/.test(s)) {
    const n = parseInt(s, 10)
    return n > 0 ? n : null
  }
  const hMatch = s.match(/(\d+)\s*h/)
  const mMatch = s.match(/(\d+)\s*m/)
  const h = hMatch ? parseInt(hMatch[1], 10) : 0
  const m = mMatch ? parseInt(mMatch[1], 10) : 0
  const total = h * 60 + m
  return total > 0 ? total : null
}

// Simple CSV parser that handles quoted fields
function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')

  for (const line of lines) {
    if (!line.trim()) continue
    const fields: string[] = []
    let i = 0
    while (i < line.length) {
      if (line[i] === '"') {
        // Quoted field
        let val = ''
        i++ // skip opening quote
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') { val += '"'; i += 2 }
          else if (line[i] === '"') { i++; break }
          else { val += line[i++] }
        }
        fields.push(val)
        if (line[i] === ',') i++
      } else {
        const end = line.indexOf(',', i)
        if (end === -1) { fields.push(line.slice(i).trim()); break }
        fields.push(line.slice(i, end).trim())
        i = end + 1
      }
    }
    rows.push(fields)
  }
  return rows
}

export function parseCsvText(text: string): CsvParseResult {
  const errors: string[] = []
  const raw = parseCSV(text)
  if (raw.length < 2) return { rows: [], errors: ['CSV must have a header row and at least one data row.'] }

  const header = raw[0].map((h) => h.toLowerCase().trim())
  const col = (name: string) => header.indexOf(name)

  const titleIdx = col('title')
  const dueDateIdx = col('duedate')
  const minIdx = col('estimatedminutes')
  const weekLabelIdx = col('weeklabel')
  const themeIdx = col('weektheme')
  const dayLabelIdx = col('daylabel')
  const notesIdx = col('notes')
  const statusIdx = col('status')
  const orderIdx = col('order')

  if (titleIdx === -1) errors.push('Missing required column: title')
  if (dueDateIdx === -1) errors.push('Missing required column: dueDate')
  if (errors.length) return { rows: [], errors }

  const rows: CsvRow[] = []
  for (let i = 1; i < raw.length; i++) {
    const r = raw[i]
    const title = r[titleIdx]?.trim() ?? ''
    if (!title) continue

    const dueDate = r[dueDateIdx]?.trim() ?? ''
    if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      errors.push(`Row ${i + 1}: invalid dueDate "${dueDate}" — use YYYY-MM-DD format`)
      continue
    }

    const rawMin = minIdx !== -1 ? r[minIdx]?.trim() ?? '' : ''
    const parsedMin = rawMin ? parseMinutesStr(rawMin) : null
    const estimatedMinutes = parsedMin ?? 30

    const weekLabel = weekLabelIdx !== -1 ? (r[weekLabelIdx]?.trim() ?? '') : ''
    const weekTheme = themeIdx !== -1 ? (r[themeIdx]?.trim() ?? '') : ''
    const dayLabel = dayLabelIdx !== -1 ? (r[dayLabelIdx]?.trim() ?? '') : ''
    const notes = notesIdx !== -1 ? (r[notesIdx]?.trim() ?? '') : ''
    const rawStatus = statusIdx !== -1 ? r[statusIdx]?.trim().toLowerCase() : 'todo'
    const status: 'todo' | 'done' = rawStatus === 'done' ? 'done' : 'todo'

    let order: number | null = null
    if (orderIdx !== -1) {
      const raw = r[orderIdx]?.trim() ?? ''
      if (raw && !isNaN(Number(raw))) order = Number(raw)
    }

    rows.push({ title, dueDate, estimatedMinutes, weekLabel, weekTheme, dayLabel, notes, status, order, _rowIndex: i })
  }

  return { rows, errors }
}

export function buildTasksFromCsvRows(rows: CsvRow[], projectId: string): Task[] {
  if (!rows.length) return []

  // Inheritance pass: fill weekLabel/weekTheme within same ISO week, dayLabel within same dueDate
  const isoKey = (iso: string) => {
    const d = parseISO(iso)
    return `${getISOWeekYear(d)}-W${String(getISOWeek(d)).padStart(2, '0')}`
  }

  const firstWeekLabel = new Map<string, string>()
  const firstWeekTheme = new Map<string, string>()
  const firstDayLabel = new Map<string, string>()
  for (const row of rows) {
    const wk = isoKey(row.dueDate)
    if (row.weekLabel && !firstWeekLabel.has(wk)) firstWeekLabel.set(wk, row.weekLabel)
    if (row.weekTheme && !firstWeekTheme.has(wk)) firstWeekTheme.set(wk, row.weekTheme)
    if (row.dayLabel && !firstDayLabel.has(row.dueDate)) firstDayLabel.set(row.dueDate, row.dayLabel)
  }

  // Collect all ISO-week keys and assign sequential week numbers
  const weekKeys = new Map<string, { dates: string[] }>()
  for (const row of rows) {
    const key = isoKey(row.dueDate)
    if (!weekKeys.has(key)) weekKeys.set(key, { dates: [] })
    weekKeys.get(key)!.dates.push(row.dueDate)
  }
  const sortedWeekKeys = Array.from(weekKeys.keys()).sort()
  const weekNumberMap = new Map<string, number>()
  sortedWeekKeys.forEach((key, idx) => weekNumberMap.set(key, idx + 1))

  // Auto weekLabel fallback per week
  const autoWeekLabelMap = new Map<string, string>()
  for (const key of sortedWeekKeys) {
    const num = weekNumberMap.get(key)!
    const { dates } = weekKeys.get(key)!
    const sorted = [...dates].sort()
    const mon = startOfWeek(parseISO(sorted[0]), { weekStartsOn: 1 })
    const sun = endOfWeek(parseISO(sorted[sorted.length - 1]), { weekStartsOn: 1 })
    autoWeekLabelMap.set(key, `Week ${num}: ${format(mon, 'MMM d')} – ${format(sun, 'MMM d, yyyy')}`)
  }

  // Sort rows by dueDate then by order (if provided) else _rowIndex
  const sortedRows = [...rows].sort((a, b) => {
    if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate)
    const ao = a.order ?? a._rowIndex
    const bo = b.order ?? b._rowIndex
    return ao - bo
  })

  const now = new Date().toISOString()
  return sortedRows.map((row, idx) => {
    const wk = isoKey(row.dueDate)
    const weekNumber = weekNumberMap.get(wk)!
    const weekLabel = row.weekLabel || firstWeekLabel.get(wk) || autoWeekLabelMap.get(wk)!
    const weekTheme = row.weekTheme || firstWeekTheme.get(wk) || ''
    const d = parseISO(row.dueDate)
    const dayLabel = row.dayLabel
      || firstDayLabel.get(row.dueDate)
      || (format(d, 'EEEE, MMMM d') + (weekTheme ? ` — ${weekTheme}` : ''))

    return {
      id: crypto.randomUUID(),
      projectId,
      title: row.title,
      estimatedMinutes: row.estimatedMinutes,
      dueDate: row.dueDate,
      dayLabel,
      weekNumber,
      weekLabel,
      weekTheme,
      status: row.status,
      completedAt: row.status === 'done' ? now : null,
      notes: row.notes,
      isCustom: false,
      order: row.order ?? idx,
      createdAt: now,
      updatedAt: now,
    }
  })
}

export const CSV_TEMPLATE = `title,dueDate,estimatedMinutes,weekLabel,weekTheme,dayLabel,notes,status,order
Setup database schema,2026-04-27,120,"Week 1: Foundation","Deliverability Triage","Monday, April 27 — Setup",Create core tables,todo,1
Deploy backend,2026-04-27,90,,,,Deploy to staging,todo,2
Review PR,2026-04-28,45,,,"Tuesday — SMS Audit",,todo,1
`
