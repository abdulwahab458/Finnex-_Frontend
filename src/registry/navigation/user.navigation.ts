import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  FileText,
  UserCircle,
} from 'lucide-react'
import type { NavigationItem } from './types'

export const userNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: Wallet,
    path: '/accounts',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ArrowLeftRight,
    path: '/transactions',
  },
  {
    id: 'budgets',
    label: 'Budgets',
    icon: PiggyBank,
    path: '/budgets',
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    path: '/goals',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: BarChart3,
    path: '/portfolio',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircle,
    path: '/profile',
  },
]
