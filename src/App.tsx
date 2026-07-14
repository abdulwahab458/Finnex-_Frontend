import './App.css'
import { AppRoutes } from '@/routes/AppRoutes'
import { useLocation } from 'react-router-dom'

function App() {
  const { pathname } = useLocation()
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  return (
    <div className={['flex flex-col bg-surface text-on-surface', isAuthRoute ? 'h-dvh overflow-hidden' : 'min-h-dvh'].join(' ')}>
      <main className={isAuthRoute ? 'flex-1 min-h-0 overflow-hidden' : 'flex-1 min-h-0'}>
        <AppRoutes />
      </main>
      
    </div>
  )
}

export default App
