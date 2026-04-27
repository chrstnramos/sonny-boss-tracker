import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, StickyNote, Edit2, Trash2, ChevronDown } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useUIStore } from '../../store/uiStore'
import { useConfetti } from '../../hooks/useConfetti'
import { EditableText, parseMinutes } from '../common/EditableText'
import { fmtMinutes, isOverdue, todayISO } from '../../utils/dates'
import type { Task } from '../../types'

interface TaskRowProps {
  task: Task
  onEdit?: (task: Task) => void
}

export function TaskRow({ task, onEdit }: TaskRowProps) {
  const { updateNotes, deleteTask, updateTask, _toggleAndReturn } = useTaskStore()
  const { recordCompletion, undoCompletion } = useSettingsStore()
  const pushUndo = useUIStore((s) => s.pushUndo)
  const { fire } = useConfetti()
  const [showNotes, setShowNotes] = useState(false)
  const [noteVal, setNoteVal] = useState(task.notes)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  // Keep local note value synced with the task prop whenever it changes
  // externally (e.g., Firestore sync, undo, or any other write path).
  // Without this, opening the notes panel later could overwrite real notes
  // with a stale empty string captured at mount time.
  useEffect(() => {
    setNoteVal(task.notes)
  }, [task.notes])

  const overdue = task.status === 'todo' && isOverdue(task.dueDate)

  const handleToggle = () => {
    const { becameDone } = _toggleAndReturn(task.id)
    if (becameDone) {
      recordCompletion(todayISO())
      fire()
    } else {
      undoCompletion()
    }
  }

  const handleNoteSave = () => {
    // Guard: don't overwrite if value hasn't actually changed
    if (noteVal === task.notes) return
    updateNotes(task.id, noteVal)
  }

  const toggleNotes = () => {
    setShowNotes((v) => {
      if (!v) setTimeout(() => noteRef.current?.focus(), 50)
      return !v
    })
  }

  return (
    <div className={`group rounded-lg transition-colors duration-100 ${overdue ? 'bg-red-500/5' : ''}`}>
      <div className="task-row">
        {/* Checkbox */}
        <button onClick={handleToggle}
          className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center
            ${task.status === 'done'
              ? 'bg-emerald-500 border-emerald-500'
              : overdue
                ? 'border-red-400/60 hover:border-red-400'
                : 'border-slate-600 hover:border-accent-400'
            }`}
        >
          {task.status === 'done' && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <EditableText
            as="p"
            value={task.title}
            onSave={(v) => updateTask(task.id, { title: v })}
            className={`text-sm leading-snug ${task.status === 'done' ? 'task-done' : overdue ? 'text-red-300' : 'text-slate-200'}`}
            inputClassName="text-sm w-full"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {overdue && <span className="text-xs text-red-400 font-medium">overdue</span>}
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={11} />
            <EditableText
              as="span"
              value={fmtMinutes(task.estimatedMinutes)}
              onSave={(v) => {
                const m = parseMinutes(v)
                if (m !== null) updateTask(task.id, { estimatedMinutes: m })
              }}
              parse={(raw) => {
                const m = parseMinutes(raw)
                return m === null ? null : String(m)
              }}
              className="text-xs"
              inputClassName="text-xs w-16"
            />
          </span>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5">
            <button onClick={toggleNotes}
              className={`btn-ghost p-1 ${(task.notes || showNotes) ? 'text-accent-400' : ''}`}
              title="Notes">
              <StickyNote size={13} />
            </button>
            {onEdit && (
              <button onClick={() => onEdit(task)} className="btn-ghost p-1" title="Edit">
                <Edit2 size={13} />
              </button>
            )}
            <button
              onClick={() => {
                deleteTask(task.id)
                pushUndo([task], `Deleted "${task.title}"`)
              }}
              className="btn-ghost p-1 hover:text-red-400"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
            {(task.notes || showNotes) && (
              <button onClick={toggleNotes} className="btn-ghost p-1">
                <ChevronDown size={13} className={`transition-transform ${showNotes ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes panel */}
      <AnimatePresence>
        {(showNotes || (task.notes && !showNotes && false)) && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
            className="overflow-hidden px-3 pb-2">
            <textarea
              ref={noteRef}
              value={noteVal}
              onChange={(e) => setNoteVal(e.target.value)}
              onBlur={handleNoteSave}
              placeholder="Add a note..."
              rows={2}
              className="w-full bg-slate-700/30 border border-slate-600/50 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-accent-500/50 resize-none transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show note preview if has notes but panel is closed */}
      {task.notes && !showNotes && (
        <button onClick={toggleNotes} className="w-full text-left px-7 pb-1.5">
          <p className="text-xs text-slate-500 italic truncate">"{task.notes}"</p>
        </button>
      )}
    </div>
  )
}
