import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, Search, X, Sliders, EyeOff, Eye, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { WeekSection } from '../components/timeline/WeekSection'
import { WeekOverviewBar } from '../components/timeline/WeekOverviewBar'
import { CustomizeWeeksModal } from '../components/timeline/CustomizeWeeksModal'
import { CsvImport } from '../components/tasks/CsvImport'
import { TaskForm } from '../components/tasks/TaskForm'
import { EditableText } from '../components/common/EditableText'
import { useTaskStore } from '../store/taskStore'
import { useProjectStore } from '../store/projectStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTimeStats } from '../hooks/useTimeStats'
import { todayISO } from '../utils/dates'

type StatusFilter = 'all' | 'todo' | 'overdue' | 'done'

const STATUS_PILLS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'Todo' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'done', label: 'Done' },
]

export function TimelinePage() {
  const tasks = useTaskStore((s) => s.tasks)
  const { projects, activeProjectId } = useProjectStore()
  const updateProject = useProjectStore((s) => s.updateProject)
  const { totalTasks, doneTasks, fmt, doneMinutes, totalMinutes } = useTimeStats()
  const { settings, setHideDone, setAllWeeksCollapsed } = useSettingsStore()
  const hideDone = settings.hideDone ?? false
  const collapsedWeeks = settings.collapsedWeeks ?? []

  const [showImport, setShowImport] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [focusWeek, setFocusWeek] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const focusWeekRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const activeProject = projects.find((p) => p.id === activeProjectId)
  const today = todayISO()

  const currentWeekNumber = useMemo(() => {
    const todayTask = tasks.find((t) => t.dueDate >= today)
    return todayTask?.weekNumber ?? 1
  }, [tasks, today])

  const weekGroups = useMemo(() => {
    const map = new Map<number, { weekLabel: string; weekTheme: string; tasks: typeof tasks }>()
    for (const t of tasks) {
      if (!map.has(t.weekNumber)) map.set(t.weekNumber, { weekLabel: t.weekLabel, weekTheme: t.weekTheme, tasks: [] })
      map.get(t.weekNumber)!.tasks.push(t)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b)
  }, [tasks])

  const visibleGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return weekGroups
      .map(([wn, data]) => {
        let filtered = data.tasks
        if (hideDone) {
          filtered = filtered.filter((t) => t.status !== 'done')
        }
        if (q) {
          filtered = filtered.filter(
            (t) => t.title.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
          )
        }
        if (statusFilter === 'todo') {
          filtered = filtered.filter((t) => t.status === 'todo' && t.dueDate >= today)
        } else if (statusFilter === 'overdue') {
          filtered = filtered.filter((t) => t.status === 'todo' && t.dueDate < today)
        } else if (statusFilter === 'done') {
          filtered = filtered.filter((t) => t.status === 'done')
        }
        return [wn, { ...data, tasks: filtered }] as [number, typeof data]
      })
      .filter(([, data]) => data.tasks.length > 0)
  }, [weekGroups, searchQuery, statusFilter, today, hideDone])

  const isFiltering = searchQuery.trim() !== '' || statusFilter !== 'all'
  const matchCount = visibleGroups.reduce((s, [, d]) => s + d.tasks.length, 0)

  // (Mount auto-scroll removed — Timeline always opens at top.)

  // Scroll to newly added week
  useEffect(() => {
    if (focusWeek === null) return
    const scrollTimer = setTimeout(() => {
      focusWeekRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    const clearTimer = setTimeout(() => setFocusWeek(null), 1800)
    return () => { clearTimeout(scrollTimer); clearTimeout(clearTimer) }
  }, [focusWeek])

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
  }, [searchOpen])

  const handleTaskAdded = useCallback((weekNumber: number) => {
    setFocusWeek(weekNumber)
  }, [])

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    setTimeout(() => searchRef.current?.focus(), 50)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchOpen(false)
    setStatusFilter('all')
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (e.key === '/' && !inInput) {
        e.preventDefault()
        openSearch()
      }
      if (e.key === 'n' && !inInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setShowAddTask(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [openSearch])

  const setWeekRef = (weekNumber: number) => (el: HTMLDivElement | null) => {
    if (weekNumber === focusWeek) focusWeekRef.current = el
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-10">
        <TopBar
          title={activeProject?.name ?? 'Timeline'}
          subtitle={`${doneTasks}/${totalTasks} tasks · ${fmt(doneMinutes)} done · ${fmt(totalMinutes - doneMinutes)} remaining`}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={searchOpen ? clearSearch : openSearch}
                className={`btn-ghost p-1.5 ${searchOpen ? 'text-accent-400' : ''}`}
                title="Search tasks (/)"
              >
                <Search size={15} />
              </button>
              <button
                onClick={() => setHideDone(!hideDone)}
                className={`btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5 ${hideDone ? 'text-accent-400' : ''}`}
                title={hideDone ? 'Show completed tasks' : 'Hide completed tasks'}
              >
                {hideDone ? <EyeOff size={13} /> : <Eye size={13} />}
                {hideDone ? 'Show done' : 'Hide done'}
              </button>
              {weekGroups.length > 0 && (
                <>
                  {(() => {
                    const allWeekNums = weekGroups.map(([n]) => n)
                    const allCollapsed = allWeekNums.length > 0 && allWeekNums.every((n) => collapsedWeeks.includes(n))
                    return (
                      <button
                        onClick={() => setAllWeeksCollapsed(allWeekNums, !allCollapsed)}
                        className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
                        title={allCollapsed ? 'Expand all weeks' : 'Collapse all weeks'}
                      >
                        {allCollapsed ? <ChevronsUpDown size={13} /> : <ChevronsDownUp size={13} />}
                        {allCollapsed ? 'Expand all' : 'Collapse all'}
                      </button>
                    )
                  })()}
                  <button
                    onClick={() => setShowCustomize(true)}
                    className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
                    title="Bulk edit week labels and themes"
                  >
                    <Sliders size={13} /> Customize weeks
                  </button>
                </>
              )}
              <button onClick={() => setShowAddTask(true)} className="btn-primary text-xs px-3 py-1.5">
                <Plus size={13} /> Add Task
              </button>
              <button onClick={() => setShowImport(true)} className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5">
                <Upload size={13} /> Import CSV
              </button>
            </div>
          }
        />

        {/* Search + filter strip */}
        {(searchOpen || statusFilter !== 'all') && (
          <div className="px-6 py-2.5 bg-slate-950/95 border-b border-slate-700/50 backdrop-blur-sm flex items-center gap-3">
            {searchOpen && (
              <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
                <Search size={13} className="text-slate-500 flex-shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && clearSearch()}
                  placeholder="Search tasks..."
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300">
                    <X size={13} />
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {STATUS_PILLS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    statusFilter === key
                      ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {searchOpen && (
              <button onClick={clearSearch} className="text-slate-500 hover:text-slate-300 flex-shrink-0">
                <X size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="p-6 space-y-3 max-w-3xl mx-auto w-full"
      >
        {/* Project overview */}
        {activeProject && (
          <div className="card p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Project Overview</p>
            <EditableText
              as="div"
              value={activeProject.overview ?? ''}
              onSave={(v) => updateProject(activeProject.id, { overview: v })}
              multiline
              emptyLabel="Click to add a project overview…"
              className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed block min-h-[1.5rem]"
              inputClassName="text-sm text-slate-200 w-full"
            />
          </div>
        )}

        {/* Week overview bar */}
        {weekGroups.length > 0 && (
          <WeekOverviewBar
            weekGroups={weekGroups}
            currentWeekNumber={currentWeekNumber}
            focusWeek={focusWeek}
            onJumpTo={(wn) => setFocusWeek(wn)}
          />
        )}

        {/* Filter results count */}
        {isFiltering && weekGroups.length > 0 && (
          <p className="text-xs text-slate-500">
            {matchCount === 0
              ? 'No tasks match'
              : `${matchCount} task${matchCount === 1 ? '' : 's'} found`}
            {searchQuery && <span className="text-slate-600"> for "{searchQuery}"</span>}
            {' · '}
            <button onClick={clearSearch} className="text-accent-400 hover:underline">clear</button>
          </p>
        )}

        {weekGroups.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-sm text-slate-300 font-medium">No tasks yet</p>
            <p className="text-xs mt-1">Import a CSV to bulk-add tasks, or add your first task manually.</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button onClick={() => setShowImport(true)} className="btn-primary">
                <Upload size={14} /> Import CSV
              </button>
              <button onClick={() => setShowAddTask(true)} className="btn-secondary">
                <Plus size={14} /> Add task manually
              </button>
            </div>
          </div>
        ) : visibleGroups.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm">No tasks match your filters.</p>
            <button onClick={clearSearch} className="text-xs text-accent-400 hover:underline mt-2 block mx-auto">
              Clear filters
            </button>
          </div>
        ) : (
          visibleGroups.map(([weekNumber, { weekLabel, weekTheme, tasks: weekTasks }]) => (
            <div key={weekNumber} ref={setWeekRef(weekNumber)}>
              <WeekSection
                weekNumber={weekNumber}
                weekLabel={weekLabel}
                weekTheme={weekTheme}
                tasks={weekTasks}
                defaultExpanded={weekNumber === currentWeekNumber}
                forceExpand={weekNumber === focusWeek}
                onTaskAdded={handleTaskAdded}
              />
            </div>
          ))
        )}
      </motion.div>

      <CustomizeWeeksModal open={showCustomize} onClose={() => setShowCustomize(false)} />
      <CsvImport open={showImport} onClose={() => setShowImport(false)} />
      <TaskForm
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAdded={handleTaskAdded}
        allTasks={tasks}
        defaultWeekNumber={currentWeekNumber}
        defaultWeekLabel={weekGroups.find(([n]) => n === currentWeekNumber)?.[1].weekLabel ?? 'Week 1'}
        defaultWeekTheme={weekGroups.find(([n]) => n === currentWeekNumber)?.[1].weekTheme ?? ''}
        defaultDueDate={today}
        defaultDayLabel={today}
      />
    </div>
  )
}
