import { AdvisorDashboardPage } from '@/features/dashboard/pages/AdvisorDashboardPage'
import { AdvisorClientsPage } from '@/features/dashboard/pages/AdvisorClientsPage'
import { AdvisorAppointmentsPage } from '@/features/dashboard/pages/AdvisorAppointmentsPage'
import { AdvisorMessagesPage } from '@/features/dashboard/pages/AdvisorMessagesPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { SupportPage } from '@/features/support/pages/SupportPage'
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
  {
    id: 'advisor-notifications',
    path: '/advisor/notifications',
    element: NotificationsPage,
    requiredRole: 'advisor',
  },
  {
    id: 'advisor-settings',
    path: '/advisor/settings',
    element: SettingsPage,
    requiredRole: 'advisor',
  },
  {
    id: 'advisor-support',
    path: '/advisor/support',
    element: SupportPage,
    requiredRole: 'advisor',
  },
]
