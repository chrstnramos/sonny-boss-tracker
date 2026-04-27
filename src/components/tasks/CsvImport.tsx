import { useState, useRef } from 'react'
import { Upload, AlertCircle, CheckCircle, FileText, Download } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { useTaskStore } from '../../store/taskStore'
import { useProjectStore } from '../../store/projectStore'
import { parseCsvText, buildTasksFromCsvRows, CSV_TEMPLATE } from '../../utils/csvImport'
import { saveTasks } from '../../storage/adapter'

interface CsvImportProps {
  open: boolean
  onClose: () => void
}

export function CsvImport({ open, onClose }: CsvImportProps) {
  const { activeProjectId } = useProjectStore()
  const { tasks, setTasks } = useTaskStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<{ count: number; errors: string[] } | null>(null)
  const [pendingText, setPendingText] = useState<string | null>(null)
  const [mode, setMode] = useState<'append' | 'replace'>('append')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const { rows, errors } = parseCsvText(text)
      setPreview({ count: rows.length, errors })
      setPendingText(rows.length > 0 ? text : null)
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    if (!pendingText) return
    const { rows } = parseCsvText(pendingText)
    const newTasks = buildTasksFromCsvRows(rows, activeProjectId)
    const next = mode === 'replace' ? newTasks : [...tasks, ...newTasks]
    saveTasks(next, activeProjectId)
    setTasks(next)
    handleClose()
  }

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'boss-tracker-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    setPreview(null)
    setPendingText(null)
    if (fileRef.current) fileRef.current.value = ''
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Import Tasks from CSV">
      <div className="space-y-4">
        {/* Format hint */}
        <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50 text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-medium text-slate-300 flex items-center gap-1.5">
              <FileText size={13} /> CSV columns
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1"
              title="Download a starter CSV template"
            >
              <Download size={12} /> Template
            </button>
          </div>
          <p><span className="text-slate-200">title</span> * — task name</p>
          <p><span className="text-slate-200">dueDate</span> * — YYYY-MM-DD (e.g. 2026-05-04)</p>
          <p className="text-slate-500 pt-1 leading-relaxed">
            Optional:
            <span className="text-slate-300"> estimatedMinutes</span> (25, 1h, 1h30m) ·
            <span className="text-slate-300"> weekLabel</span> ·
            <span className="text-slate-300"> weekTheme</span> ·
            <span className="text-slate-300"> dayLabel</span> ·
            <span className="text-slate-300"> notes</span> ·
            <span className="text-slate-300"> status</span> (todo/done) ·
            <span className="text-slate-300"> order</span>
          </p>
          <p className="text-slate-600 text-[10px] pt-1">
            Tip: weekLabel/weekTheme/dayLabel only need to be filled once per group — blank rows inherit. Quote values containing commas: <code className="text-slate-400">"Week 1: Apr 27 – May 1, 2026"</code>
          </p>
        </div>

        {/* File picker */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">CSV file</label>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="block w-full text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-accent-500/20 file:text-accent-300 hover:file:bg-accent-500/30 file:cursor-pointer cursor-pointer"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className={`rounded-lg p-3 border text-sm ${
            preview.errors.length === 0
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            {preview.errors.length === 0 ? (
              <div className="flex items-center gap-2">
                <CheckCircle size={15} />
                <span>{preview.count} tasks ready to import</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle size={15} />
                  <span>{preview.errors.length} error{preview.errors.length !== 1 ? 's' : ''} found</span>
                </div>
                {preview.errors.map((e, i) => <p key={i} className="text-xs pl-5">{e}</p>)}
                {preview.count > 0 && (
                  <p className="text-xs pl-5 text-amber-300 pt-1">
                    {preview.count} valid rows will still be imported (invalid rows skipped)
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mode toggle */}
        {preview && preview.count > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Import mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(['append', 'replace'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    mode === m
                      ? 'bg-accent-500/20 border-accent-500/40 text-accent-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {m === 'append' ? 'Add to existing tasks' : 'Replace all tasks'}
                </button>
              ))}
            </div>
            {mode === 'replace' && (
              <p className="text-xs text-amber-400 mt-1.5">
                ⚠ This will delete all current tasks in this project.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={handleClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleImport}
            disabled={!pendingText || (preview?.count ?? 0) === 0}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload size={14} />
            Import {preview?.count ? `${preview.count} tasks` : ''}
          </button>
        </div>
      </div>
    </Modal>
  )
}
