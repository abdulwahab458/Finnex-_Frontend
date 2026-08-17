import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  FileText,
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
    id: 'portfolio',
    label: 'Portfolio',
    icon: BarChart3,
    path: '/portfolio',

  },
  {
    id: 'budgets',
    label: 'Budgets & Goals',
    icon: PiggyBank,
    path: '/budgets',
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: FileText,
    path: '/reports',
  },
]
