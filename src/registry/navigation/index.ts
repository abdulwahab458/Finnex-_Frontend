import { userNavigation } from './user.navigation'
import { advisorNavigation } from './advisor.navigation'
import { adminNavigation } from './admin.navigation'
import type { NavigationRegistry, UserRole, NavigationConfig } from './types'

export const navigationRegistry: NavigationRegistry = {
  user: {
    basePath: '/user',
    items: userNavigation,
  },
  advisor: {
    basePath: '/advisor',
    items: advisorNavigation,
  },
  admin: {
    basePath: '/admin',
    items: adminNavigation,
  },
}

export function getNavigationByRole(role: UserRole): NavigationConfig | undefined {
  return navigationRegistry[role]
}

export type { NavigationItem, NavigationConfig, UserRole, NavigationRegistry } from './types'
