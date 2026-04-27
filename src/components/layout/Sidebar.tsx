import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, AlignLeft, CalendarCheck, Flame, ChevronDown, Plus, Check, Edit2, Trash2, PanelLeftClose, PanelLeftOpen, AlertTriangle } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'
import { useTimeStats } from '../../hooks/useTimeStats'
import { useProjectStore } from '../../store/projectStore'
import { useTaskStore } from '../../store/taskStore'
import { useUIStore } from '../../store/uiStore'
import { ProjectForm } from '../projects/ProjectForm'
import { Modal } from '../ui/Modal'
import { SyncBadge } from './SyncBadge'
import type { Project } from '../../types'

const COLOR_HEX: Record<string, string> = {
  indigo: '#6366f1',
  violet: '#8b5cf6',
  rose:   '#f43f5e',
  amber:  '#f59e0b',
  teal:   '#14b8a6',
  sky:    '#0ea5e9',
}

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timeline', icon: AlignLeft, label: 'Timeline' },
  { to: '/today', icon: CalendarCheck, label: 'Today' },
]

function SonnyLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="text-accent-400 flex-shrink-0">
      <path d="M11.5 2L4 11h6.5L9 18l7-9h-6.5L11.5 2z" fill="currentColor" strokeLinejoin="round"/>
    </svg>
  )
}

function ProjectSwitcher({ collapsed }: { collapsed: boolean }) {
  const { projects, activeProjectId, setActiveProject, deleteProject } = useProjectStore()
  const loadTasksForProject = useTaskStore((s) => s.loadForProject)
  const loadSettingsForProject = useSettingsStore((s) => s.loadForProject)
  const [open, setOpen] = useState(false)
  const [showNewProject, setShowNewProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  const active = projects.find((p) => p.id === activeProjectId) ?? projects[0]

  const switchTo = (p: Project) => {
    if (p.id === activeProjectId) { setOpen(false); return }
    setActiveProject(p.id)
    loadTasksForProject(p.id)
    loadSettingsForProject(p.id)
    setOpen(false)
  }

  const confirmDelete = () => {
    if (!deletingProject) return
    const newActiveId = deleteProject(deletingProject.id)
    if (newActiveId !== activeProjectId) {
      loadTasksForProject(newActiveId)
      loadSettingsForProject(newActiveId)
    }
    setDeletingProject(null)
  }

  // Dropdown panel — shared across both modes
  const dropdownPanel = (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={`absolute z-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden ${
              collapsed ? 'left-full ml-2 top-0 w-56' : 'left-0 right-0 top-full mt-1'
            }`}
          >
            <div className="py-1 max-h-64 overflow-y-auto">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center hover:bg-slate-700 transition-colors group">
                  <button
                    type="button"
                    onClick={() => switchTo(p)}
                    className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left min-w-0"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLOR_HEX[p.color] ?? COLOR_HEX.indigo }}
                    />
                    <span className="flex-1 text-sm text-slate-200 truncate">{p.name}</span>
                    {p.id === activeProjectId && <Check size={13} className="text-accent-400 flex-shrink-0" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingProject(p); setOpen(false) }}
                    className="px-1.5 py-2.5 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                    title="Edit project"
                  >
                    <Edit2 size={12} />
                  </button>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDeletingProject(p); setOpen(false) }}
                      className="px-2 py-2.5 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                      title="Delete project"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700">
              <button
                type="button"
                onClick={() => { setOpen(false); setShowNewProject(true) }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-700 transition-colors text-left text-sm text-accent-400"
              >
                <Plus size={14} /> New project
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (collapsed) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
          title={active?.name ?? 'Select project'}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLOR_HEX[active?.color ?? 'indigo'] ?? COLOR_HEX.indigo }}
          />
        </button>
        {dropdownPanel}
        <ProjectForm open={showNewProject} onClose={() => setShowNewProject(false)} />
        <ProjectForm open={!!editingProject} onClose={() => setEditingProject(null)} editProject={editingProject} />
        <Modal open={!!deletingProject} onClose={() => setDeletingProject(null)} title="Delete project?" size="sm">
          <DeleteContent project={deletingProject} onCancel={() => setDeletingProject(null)} onConfirm={confirmDelete} />
        </Modal>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: COLOR_HEX[active?.color ?? 'indigo'] ?? COLOR_HEX.indigo }}
        />
        <span className="flex-1 text-left text-sm font-semibold text-slate-100 truncate leading-tight">
          {active?.name ?? 'Select project'}
        </span>
        <ChevronDown size={13} className={`text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {active?.description && (
        <p className="text-xs text-slate-500 pl-8 leading-snug -mt-0.5 truncate">{active.description}</p>
      )}

      {dropdownPanel}

      <ProjectForm open={showNewProject} onClose={() => setShowNewProject(false)} />
      <ProjectForm open={!!editingProject} onClose={() => setEditingProject(null)} editProject={editingProject} />
      <Modal open={!!deletingProject} onClose={() => setDeletingProject(null)} title="Delete project?" size="sm">
        <DeleteContent project={deletingProject} onCancel={() => setDeletingProject(null)} onConfirm={confirmDelete} />
      </Modal>
    </div>
  )
}

function DeleteContent({ project, onCancel, onConfirm }: { project: Project | null; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-start">
        <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-red-400" />
        </div>
        <div className="text-sm text-slate-300">
          <p>
            Permanently delete <span className="font-semibold text-slate-100">{project?.name}</span>?
          </p>
          <p className="text-xs text-slate-500 mt-1">
            All tasks, settings, and history for this project will be removed. This cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button
          onClick={onConfirm}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={13} /> Delete project
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const streak = useSettingsStore((s) => s.settings.streakData)
  const { doneTasks, totalTasks, pct } = useTimeStats()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const widthClass = sidebarCollapsed ? 'w-14' : 'w-56'

  return (
    <aside className={`${widthClass} flex-shrink-0 h-screen sticky top-0 flex flex-col bg-slate-900 border-r border-slate-700/50 transition-[width] duration-300 ease-in-out`}>
      {/* Header: Sonny logo + collapse toggle + project switcher */}
      <div className={`${sidebarCollapsed ? 'px-2 pt-3 pb-2' : 'px-4 pt-5 pb-3'} border-b border-slate-700/50 transition-all duration-300`}>
        {!sidebarCollapsed ? (
          <>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <SonnyLogo />
                  <p className="text-base font-bold text-slate-100 tracking-tight">Sonny</p>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 italic pl-7">Built for you, son.</p>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="text-slate-500 hover:text-slate-300 p-1 -mr-1 mt-0.5 transition-colors"
                title="Collapse sidebar"
              >
                <PanelLeftClose size={15} />
              </button>
            </div>
            <ProjectSwitcher collapsed={false} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {/* Sonny logo always visible */}
            <div className="w-9 h-9 flex items-center justify-center" title="Sonny">
              <SonnyLogo size={22} />
            </div>
            {/* Collapse toggle */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-accent-400 transition-colors rounded-lg hover:bg-slate-800"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
            {/* Divider */}
            <div className="w-6 h-px bg-slate-700/50 my-0.5" />
            <ProjectSwitcher collapsed={true} />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            title={sidebarCollapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <Icon size={16} />
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: progress + streak */}
      {!sidebarCollapsed ? (
        <motion.div
          key="expanded-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="px-3 pb-4 space-y-3"
        >
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Overall Progress</span>
              <span className="text-xs font-bold text-slate-200 tabular-nums">{pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-1.5 bg-accent-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">{doneTasks} / {totalTasks} tasks</p>
          </div>

          <div className={`rounded-xl p-3 border ${
            streak.currentStreak >= 3
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-slate-800 border-slate-700/40'
          }`}>
            <div className="flex items-center gap-1.5">
              <Flame size={14} className={streak.currentStreak > 0 ? 'text-amber-400' : 'text-slate-500'} />
              <span className={`text-xs font-semibold ${streak.currentStreak > 0 ? 'text-amber-300' : 'text-slate-500'}`}>
                {streak.currentStreak > 0 ? `${streak.currentStreak}-day streak` : 'No streak yet'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 pl-0.5">{streak.totalCompleted} tasks completed</p>
          </div>

          <SyncBadge />
        </motion.div>
      ) : (
        <motion.div
          key="collapsed-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="px-2 pb-3 flex flex-col items-center gap-2.5"
        >
          <div title={`${pct}% · ${doneTasks}/${totalTasks} tasks`}
            className="w-9 h-9 rounded-full bg-slate-800 border border-accent-500/30 flex items-center justify-center text-[10px] font-bold tabular-nums text-accent-300">
            {pct}%
          </div>
          {streak.currentStreak > 0 && (
            <div title={`${streak.currentStreak}-day streak`} className="flex items-center gap-0.5">
              <Flame size={13} className="text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-300 tabular-nums">{streak.currentStreak}</span>
            </div>
          )}
        </motion.div>
      )}
    </aside>
  )
}
