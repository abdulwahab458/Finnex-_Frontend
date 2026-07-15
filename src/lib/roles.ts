import type { UserRole } from '@/registry/navigation/types'
import { getNavigationByRole } from '@/registry/navigation'

const ROLE_ALIASES: Record<string, UserRole> = {
  user: 'user',
  client: 'user',
  advisor: 'advisor',
  admin: 'admin',
}

export function normalizeRole(role: string | undefined | null): UserRole {
  const key = role?.trim().toLowerCase() ?? ''
  return ROLE_ALIASES[key] ?? 'user'
}

export function getDashboardPath(role: string | undefined | null): string {
  const normalizedRole = normalizeRole(role)
  const config = getNavigationByRole(normalizedRole)
  const dashboard = config?.items.find((item) => item.id === 'dashboard')

  if (!config || !dashboard) {
    return '/'
  }

  return `${config.basePath}${dashboard.path}`
}
