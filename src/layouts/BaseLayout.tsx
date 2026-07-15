import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/navbar/Navbar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Footer } from '@/components/footer/Footer'
import { filterByPermissions } from '@/lib/permissions'
import { normalizeRole } from '@/lib/roles'
import { getNavigationByRole } from '@/registry/navigation'
import { authStore } from '@/store/authStore'

export function BaseLayout() {
  const user = authStore.user
  const role = normalizeRole(user?.role)
  const navConfig = getNavigationByRole(role)
  const items = filterByPermissions(navConfig?.items ?? [], user?.permissions)
  const basePath = navConfig?.basePath ?? '/'

  return (
    <div className="flex h-screen overflow-hidden">
  <Sidebar items={items} basePath={basePath} />

  <div className="flex min-w-0 flex-1 flex-col">
    <Navbar />

    <main className="min-h-0 flex-1 overflow-y-auto">
      <Outlet />
    </main>

    <Footer />
  </div>
</div>
  )
}
