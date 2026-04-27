interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
