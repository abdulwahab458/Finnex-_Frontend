import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/navbar/Navbar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Footer } from '@/components/footer/Footer'

export function DashboardLayout() {
  return (
    <div className="grid min-h-dvh grid-cols-1 gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
      <Sidebar />
      <main className="min-w-0">
        <Navbar />
        <Outlet />
        <Footer/>
      </main>
    </div>
  )
}