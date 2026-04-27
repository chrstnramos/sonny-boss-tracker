import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { TimelinePage } from './pages/TimelinePage'
import { TodayPage } from './pages/TodayPage'
import { initApp } from './utils/seed'
import { useFirestoreSync } from './hooks/useFirestoreSync'

function App() {
  useFirestoreSync()
  useEffect(() => {
    document.documentElement.classList.add('dark')
    ;(async () => { await initApp() })()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/today" element={<TodayPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
