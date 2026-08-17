import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage'
import { BudgetsPage } from '@/features/budgets/pages/BudgetsPage'
import { GoalsPage } from '@/features/goals/pages/GoalsPage'
import { PortfolioPage} from '@/features/portfolio/pages/PortfolioPage'
import { LoansPage } from '@/features/reports/pages/Loanspage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { SupportPage } from '@/features/support/pages/SupportPage'
import type { RouteDefinition } from './types'
import { PortfolioDetailPage } from '@/features/portfolio/pages/PortfolioDetailPage'

export const userRoutes: RouteDefinition[] = [
  {
    id: 'user-dashboard',
    path: '/user/dashboard',
    element: DashboardPage,
    requiredRole: 'user',
  },
  {
    id: 'user-accounts',
    path: '/user/accounts',
    element: AccountsPage,
    requiredRole: 'user',
  },
  {
    id: 'user-transactions',
    path: '/user/transactions',
    element: TransactionsPage,
    requiredRole: 'user',
  },
  {
    id: 'user-budgets',
    path: '/user/budgets',
    element: BudgetsPage,
    requiredRole: 'user',
    children: [
      {
        id: 'user-portfolio-detail',
        path: '/user/budgets/goals',
        element: GoalsPage,
        requiredRole: 'user',
      },
    ],
  },
  {
    id: 'user-portfolio',
    path: '/user/portfolio',
    element: PortfolioPage,
    requiredRole: 'user',
    children: [
      {
        id: 'user-portfolio-detail',
        path: '/user/portfolio/:id',
        element: PortfolioDetailPage,
        requiredRole: 'user',
      },
    ],
  },
  {
    id: 'user-reports',
    path: '/user/reports',
    element: LoansPage,
    requiredRole: 'user',
  },
  {
    id: 'user-profile',
    path: '/user/profile',
    element: ProfilePage,
    requiredRole: 'user',
  },
  {
    id: 'user-notifications',
    path: '/user/notifications',
    element: NotificationsPage,
    requiredRole: 'user',
  },
  {
    id: 'user-settings',
    path: '/user/settings',
    element: SettingsPage,
    requiredRole: 'user',
  },
  {
    id: 'user-support',
    path: '/user/support',
    element: SupportPage,
    requiredRole: 'user',
  },
]
