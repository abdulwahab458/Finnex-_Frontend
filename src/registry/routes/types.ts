import type { ComponentType } from 'react'
import type { UserRole } from '@/registry/navigation/types'

export interface RouteDefinition {
  id: string
  path: string
  element: ComponentType
  requiredRole: UserRole
  permissions?: string[]
  layout?: ComponentType
  children?: RouteDefinition[]
}

export type RouteRegistry = RouteDefinition[]
