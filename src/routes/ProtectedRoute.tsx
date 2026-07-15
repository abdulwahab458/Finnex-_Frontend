import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasPermissions } from '@/lib/permissions'
import { normalizeRole } from '@/lib/roles'
import type { UserRole } from '@/registry/navigation/types'
import { getAccessToken, getStoredUser } from '@/services/tokenService'

interface ProtectedRouteProps {
  requiredRole?: UserRole
  permissions?: string[]
  children?: ReactNode
}

export function ProtectedRoute({ requiredRole, permissions, children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!getAccessToken()) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (requiredRole || permissions?.length) {
    const user = getStoredUser()
    const role = normalizeRole(user?.role)

    if (requiredRole && role !== requiredRole) {
      return <Navigate replace to="/unauthorized" />
    }

    if (!hasPermissions(user?.permissions, permissions)) {
      return <Navigate replace to="/unauthorized" />
    }
  }

  return children ? <>{children}</> : <Outlet />
}
