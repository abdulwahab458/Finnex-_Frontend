import { Navigate } from 'react-router-dom'
import { getDashboardPath } from '@/lib/roles'
import { getStoredUser } from '@/services/tokenService'

export function RoleDashboardRedirect() {
  const user = getStoredUser()
  const path = getDashboardPath(user?.role)

  return <Navigate replace to={path} />
}
