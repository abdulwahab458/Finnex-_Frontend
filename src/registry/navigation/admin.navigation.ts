import { LayoutDashboard, Users, Shield, Settings, FileText } from 'lucide-react'
import type { NavigationItem } from './types'

export const adminNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/users',
    permissions: ['users:read'],
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: Shield,
    path: '/roles',
    permissions: ['roles:read'],
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    icon: FileText,
    path: '/audit-logs',
    permissions: ['audit:read'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
]
