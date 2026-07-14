import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from '@/services/tokenService'

export function GuestRoute() {
  if (getAccessToken()) {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}