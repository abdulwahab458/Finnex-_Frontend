import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { BaseLayout } from '@/layouts/BaseLayout'
import { EmptyLayout } from '@/layouts/EmptyLayout'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleDashboardRedirect } from './RoleDashboardRedirect'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { NotFound } from '@/pages/NotFound'
import { Unauthorized } from '@/pages/Unauthorized'
import { getRegistryRoutes } from '@/registry/routes'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<RoleDashboardRedirect />} />
          {getRegistryRoutes()}
        </Route>
      </Route>

      <Route element={<EmptyLayout />}>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}