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
  const routes: ReactNode[] = []

  function flattenRoute(route: RouteDefinition) {
    const Component = route.element

    routes.push(
      <Route
        key={route.id}
        path={route.path}
        element={
          <ProtectedRoute requiredRole={route.requiredRole} permissions={route.permissions}>
            <Component />
          </ProtectedRoute>
        }
      />,
    )

    if (route.children) {
      for (const child of route.children) {
        flattenRoute({
          ...child,
          requiredRole: child.requiredRole ?? route.requiredRole,
          permissions: child.permissions ?? route.permissions,
        })
      }
    }
  }

  for (const route of routeRegistry) {
    flattenRoute(route)
  }

  return routes
}

export type { RouteDefinition, RouteRegistry } from './types'
