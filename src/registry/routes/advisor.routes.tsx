import { AdvisorDashboardPage } from '@/features/dashboard/pages/AdvisorDashboardPage'
import { AdvisorClientsPage } from '@/features/dashboard/pages/AdvisorClientsPage'
import { AdvisorAppointmentsPage } from '@/features/dashboard/pages/AdvisorAppointmentsPage'
import { AdvisorMessagesPage } from '@/features/dashboard/pages/AdvisorMessagesPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import type { RouteDefinition } from './types'

export const advisorRoutes: RouteDefinition[] = [
  {
    id: 'advisor-dashboard',
    path: '/advisor/dashboard',
    element: AdvisorDashboardPage,
    requiredRole: 'advisor',
  },
  {
    id: 'advisor-clients',
    path: '/advisor/clients',
    element: AdvisorClientsPage,
    requiredRole: 'advisor',
  },
  {
    id: 'advisor-appointments',
    path: '/advisor/appointments',
    element: AdvisorAppointmentsPage,
    requiredRole: 'advisor',
  },
  {
    id: 'advisor-messages',
    path: '/advisor/messages',
    element: AdvisorMessagesPage,
    requiredRole: 'advisor',
  },
  {
    id: 'advisor-profile',
    path: '/advisor/profile',
    element: ProfilePage,
    requiredRole: 'advisor',
  },
]
