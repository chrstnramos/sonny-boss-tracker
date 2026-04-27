import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { useProjectStore } from '../../store/projectStore'
import { useTaskStore } from '../../store/taskStore'
import { useSettingsStore } from '../../store/settingsStore'
import type { Project } from '../../types'

const COLORS = [
  { key: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { key: 'violet', hex: '#8b5cf6', label: 'Violet' },
  { key: 'rose',   hex: '#f43f5e', label: 'Rose' },
  { key: 'amber',  hex: '#f59e0b', label: 'Amber' },
  { key: 'teal',   hex: '#14b8a6', label: 'Teal' },
  { key: 'sky',    hex: '#0ea5e9', label: 'Sky' },
]

interface ProjectFormProps {
  open: boolean
  onClose: () => void
  editProject?: Project | null
}

export function ProjectForm({ open, onClose, editProject }: ProjectFormProps) {
  const { createProject, updateProject, setActiveProject } = useProjectStore()
  const loadTasksForProject = useTaskStore((s) => s.loadForProject)
  const loadSettingsForProject = useSettingsStore((s) => s.loadForProject)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [overview, setOverview] = useState('')
  const [color, setColor] = useState('indigo')

  useEffect(() => {
    if (editProject) {
      setName(editProject.name)
      setDescription(editProject.description)
      setOverview(editProject.overview ?? '')
      setColor(editProject.color)
    } else {
      setName('')
      setDescription('')
      setOverview('')
      setColor('indigo')
    }
  }, [editProject, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editProject) {
      updateProject(editProject.id, { name: name.trim(), description: description.trim(), color, overview: overview.trim() })
    } else {
      const project = createProject(name.trim(), description.trim(), color, overview.trim())
      setActiveProject(project.id)
      loadTasksForProject(project.id)
      loadSettingsForProject(project.id)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editProject ? 'Edit Project' : 'New Project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Project name *</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Q3 Marketing Sprint"
            className="input-base"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
            className="input-base"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Project overview</label>
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Long-form context, goals, constraints… (optional)"
            rows={4}
            className="input-base resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setColor(c.key)}
                title={c.label}
                className={`w-7 h-7 rounded-full transition-all ${color === c.key ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">
            {editProject ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
