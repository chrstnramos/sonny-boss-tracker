import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

interface EditableTextProps {
  value: string
  onSave: (next: string) => void
  className?: string
  placeholder?: string
  multiline?: boolean
  emptyLabel?: string
  inputClassName?: string
  as?: 'span' | 'p' | 'h2' | 'h3' | 'h4' | 'div'
  /** If true, shows editor right away. Parent controls when to enter edit mode. */
  autoEdit?: boolean
  onBlurEditor?: () => void
  /** Parse/validate the typed value before save. Return null to reject. */
  parse?: (raw: string) => string | null
}

export function EditableText({
  value,
  onSave,
  className = '',
  placeholder = '',
  multiline = false,
  emptyLabel,
  inputClassName = '',
  as = 'span',
  autoEdit = false,
  onBlurEditor,
  parse,
}: EditableTextProps) {
  const [editing, setEditing] = useState(autoEdit)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      // select all
      try {
        if (inputRef.current instanceof HTMLInputElement) inputRef.current.select()
        else inputRef.current.setSelectionRange(0, inputRef.current.value.length)
      } catch { /* noop */ }
    }
  }, [editing])

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed === value) {
      setEditing(false)
      onBlurEditor?.()
      return
    }
    if (parse) {
      const parsed = parse(trimmed)
      if (parsed === null) {
        setDraft(value)
        setEditing(false)
        onBlurEditor?.()
        return
      }
      onSave(parsed)
    } else {
      onSave(trimmed)
    }
    setEditing(false)
    onBlurEditor?.()
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
    onBlurEditor?.()
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }

  if (editing) {
    const sharedProps = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: handleKey,
      placeholder,
      className: `bg-slate-700/40 border border-accent-500/50 rounded px-1.5 py-0.5 text-inherit focus:outline-none focus:border-accent-500 ${inputClassName}`,
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
    }
    if (multiline) {
      return (
        <textarea
          ref={(el) => { inputRef.current = el }}
          rows={3}
          {...sharedProps}
          className={`${sharedProps.className} w-full resize-y`}
        />
      )
    }
    return (
      <input
        ref={(el) => { inputRef.current = el }}
        type="text"
        {...sharedProps}
      />
    )
  }

  const isEmpty = !value || value.trim() === ''
  const display = isEmpty ? (emptyLabel ?? placeholder ?? '') : value
  const emptyClass = isEmpty ? 'italic text-slate-600' : ''

  const Tag = as as any
  return (
    <Tag
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); setEditing(true) }}
      className={`cursor-text rounded hover:bg-slate-700/20 hover:ring-1 hover:ring-slate-600/40 transition-colors px-0.5 -mx-0.5 ${emptyClass} ${className}`}
      title="Click to edit"
    >
      {display}
    </Tag>
  )
}

/**
 * Inline editor for minutes. Accepts "25", "1h", "1h30m", "1h 30m", "90m".
 * Displays via fmtMinutes when not editing.
 */
export function parseMinutes(raw: string): number | null {
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
