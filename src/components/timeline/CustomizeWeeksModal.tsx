import { useEffect, useMemo, useState } from 'react'
import { Modal } from '../ui/Modal'
import { useTaskStore } from '../../store/taskStore'

interface CustomizeWeeksModalProps {
  open: boolean
  onClose: () => void
}

interface Row {
  weekNumber: number
  weekLabel: string
  weekTheme: string
  taskCount: number
}

export function CustomizeWeeksModal({ open, onClose }: CustomizeWeeksModalProps) {
  const tasks = useTaskStore((s) => s.tasks)
  const updateWeekMeta = useTaskStore((s) => s.updateWeekMeta)

  const initialRows: Row[] = useMemo(() => {
    const map = new Map<number, Row>()
    for (const t of tasks) {
      if (!map.has(t.weekNumber)) {
        map.set(t.weekNumber, {
          weekNumber: t.weekNumber,
          weekLabel: t.weekLabel,
          weekTheme: t.weekTheme,
          taskCount: 0,
        })
      }
      map.get(t.weekNumber)!.taskCount += 1
    }
    return Array.from(map.values()).sort((a, b) => a.weekNumber - b.weekNumber)
  }, [tasks])

  const [rows, setRows] = useState<Row[]>(initialRows)

  useEffect(() => {
    if (open) setRows(initialRows)
  }, [open, initialRows])

  const handleSave = () => {
    // Diff rows against initial — only call updateWeekMeta for changed ones
    const byWeek = new Map(initialRows.map((r) => [r.weekNumber, r]))
    for (const row of rows) {
      const orig = byWeek.get(row.weekNumber)
      if (!orig) continue
      const updates: { weekLabel?: string; weekTheme?: string } = {}
      if (row.weekLabel !== orig.weekLabel) updates.weekLabel = row.weekLabel
      if (row.weekTheme !== orig.weekTheme) updates.weekTheme = row.weekTheme
      if (Object.keys(updates).length > 0) {
        updateWeekMeta(row.weekNumber, updates)
      }
    }
    onClose()
  }

  const updateRow = (weekNumber: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.weekNumber === weekNumber ? { ...r, ...patch } : r)))
  }

  return (
    <Modal open={open} onClose={onClose} title="Customize Weeks">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {rows.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No weeks with tasks yet.</p>
        )}
        {rows.map((row) => (
          <div key={row.weekNumber} className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-accent-400 uppercase tracking-wide">
                Week {row.weekNumber}
              </span>
              <span className="text-[10px] text-slate-500">
                {row.taskCount} task{row.taskCount === 1 ? '' : 's'}
              </span>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Label</label>
              <input
                value={row.weekLabel}
                onChange={(e) => updateRow(row.weekNumber, { weekLabel: e.target.value })}
                className="input-base text-sm"
                placeholder="Week label"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Theme</label>
              <input
                value={row.weekTheme}
                onChange={(e) => updateRow(row.weekNumber, { weekTheme: e.target.value })}
                className="input-base text-sm"
                placeholder="e.g., Deliverability Triage"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-4 mt-3 border-t border-slate-700/40">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="button" onClick={handleSave} className="btn-primary" disabled={rows.length === 0}>
          Save Changes
        </button>
      </div>
    </Modal>
  )
}
