import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAccessToken } from '@/services/tokenService'

export function ProtectedRoute() {
  const location = useLocation()

  if (!getAccessToken()) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}