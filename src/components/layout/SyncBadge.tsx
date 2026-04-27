import { useSyncStore } from '../../store/syncStore'
import { isFirebaseConfigured } from '../../lib/firebase'

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 10) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function SyncBadge() {
  const { status, lastSyncedAt, errorMessage } = useSyncStore()

  if (!isFirebaseConfigured()) {
    return (
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />
        <span className="text-xs text-slate-600">Firebase not configured</span>
      </div>
    )
  }

  const configs: Record<string, { dot: string; label: string; sub?: string }> = {
    idle: { dot: 'bg-slate-500', label: 'Connecting…' },
    syncing: { dot: 'bg-amber-400 animate-pulse', label: 'Syncing…' },
    synced: {
      dot: 'bg-emerald-400',
      label: 'Synced',
      sub: lastSyncedAt ? timeAgo(lastSyncedAt) : undefined,
    },
    error: {
      dot: 'bg-red-400',
      label: 'Sync error',
      sub: errorMessage ?? undefined,
    },
    offline: { dot: 'bg-slate-400', label: 'Offline', sub: 'Will retry on next change' },
  }

  const cfg = configs[status]

  return (
    <div className="flex items-start gap-2 px-1 py-1" title={errorMessage ?? undefined}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${cfg.dot}`} />
      <div className="min-w-0">
        <p className={`text-xs font-medium leading-tight ${
          status === 'synced' ? 'text-emerald-400/80'
          : status === 'error' ? 'text-red-400'
          : status === 'offline' ? 'text-slate-400'
          : 'text-amber-400/80'
        }`}>
          {cfg.label}
        </p>
        {cfg.sub && (
          <p className="text-[10px] text-slate-600 truncate leading-tight mt-0.5">{cfg.sub}</p>
        )}
      </div>
    </div>
  )
}
