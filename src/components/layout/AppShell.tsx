import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { UndoToast } from './UndoToast'

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <UndoToast />
    </div>
  )
}
