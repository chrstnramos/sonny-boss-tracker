import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Undo2, X } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useTaskStore } from '../../store/taskStore'
import { useSettingsStore } from '../../store/settingsStore'

export function UndoToast() {
  const pendingUndo = useUIStore((s) => s.pendingUndo)
  const consumeUndo = useUIStore((s) => s.consumeUndo)
  const clearUndo = useUIStore((s) => s.clearUndo)
  const addRawTasks = useTaskStore((s) => s.addRawTasks)
  const undoCompletion = useSettingsStore((s) => s.undoCompletion)

  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (!pendingUndo) return
    const tick = () => {
      const ms = pendingUndo.expiresAt - Date.now()
      if (ms <= 0) {
        clearUndo()
      } else {
        setSecondsLeft(Math.ceil(ms / 1000))
      }
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [pendingUndo, clearUndo])

  const handleUndo = () => {
    const consumed = consumeUndo()
    if (!consumed) return
    addRawTasks(consumed.tasks)
    if (consumed.completionCount > 0) {
      undoCompletion(consumed.completionCount)
    }
  }

  return (
    <AnimatePresence>
      {pendingUndo && (
        <motion.div
          key="undo-toast"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md shadow-2xl px-4 py-3 min-w-[280px]"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200">{pendingUndo.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Undo available for {secondsLeft}s</p>
          </div>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent-400 hover:text-accent-300 px-3 py-1.5 rounded-lg bg-accent-500/10 hover:bg-accent-500/20 transition-colors"
          >
            <Undo2 size={13} /> Undo
          </button>
          <button
            onClick={clearUndo}
            className="text-slate-500 hover:text-slate-300 p-1"
            title="Dismiss"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
