import { AdminDashboardPage } from '@/features/dashboard/pages/AdminDashboardPage'
import { AdminUsersPage } from '@/features/dashboard/pages/AdminUsersPage'
import { AdminRolesPage } from '@/features/dashboard/pages/AdminRolesPage'
import { AdminAuditLogsPage } from '@/features/dashboard/pages/AdminAuditLogsPage'
import { AdminSettingsPage } from '@/features/dashboard/pages/AdminSettingsPage'
import type { RouteDefinition } from './types'

export const adminRoutes: RouteDefinition[] = [
  {
    id: 'admin-dashboard',
    path: '/admin/dashboard',
    element: AdminDashboardPage,
    requiredRole: 'admin',
  },
  {
    id: 'admin-users',
    path: '/admin/users',
    element: AdminUsersPage,
    requiredRole: 'admin',
    permissions: ['users:read'],
  },
  {
    id: 'admin-roles',
    path: '/admin/roles',
    element: AdminRolesPage,
    requiredRole: 'admin',
    permissions: ['roles:read'],
  },
  {
    id: 'admin-audit-logs',
    path: '/admin/audit-logs',
    element: AdminAuditLogsPage,
    requiredRole: 'admin',
    permissions: ['audit:read'],
  },
  {
    id: 'admin-settings',
    path: '/admin/settings',
    element: AdminSettingsPage,
    requiredRole: 'admin',
  },
]
