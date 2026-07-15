import type { LucideIcon } from 'lucide-react'

export type UserRole = 'user' | 'advisor' | 'admin'

export interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
  children?: NavigationItem[]
  permissions?: string[]
  badge?: string | number
  disabled?: boolean
}

export interface NavigationConfig {
  basePath: string
  items: NavigationItem[]
}

export type NavigationRegistry = Record<UserRole, NavigationConfig>
