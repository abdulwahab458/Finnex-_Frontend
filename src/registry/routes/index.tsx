import type { ReactNode } from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { userRoutes } from './user.routes'
import { advisorRoutes } from './advisor.routes'
import { adminRoutes } from './admin.routes'
import type { RouteDefinition, RouteRegistry } from './types'

export const routeRegistry: RouteRegistry = [...userRoutes, ...advisorRoutes, ...adminRoutes]

export function getRoutesByRole(role: RouteDefinition['requiredRole']): RouteDefinition[] {
  return routeRegistry.filter((route) => route.requiredRole === role)
}

export function getRegistryRoutes(): ReactNode[] {
  return routeRegistry.map((route) => {
    const Component = route.element

    return (
      <Route
        key={route.id}
        path={route.path}
        element={
          <ProtectedRoute requiredRole={route.requiredRole} permissions={route.permissions}>
            <Component />
          </ProtectedRoute>
        }
      />
    )
  })
}

export type { RouteDefinition, RouteRegistry } from './types'
