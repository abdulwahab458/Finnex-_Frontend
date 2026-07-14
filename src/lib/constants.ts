export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Modern Trust '

export const DASHBOARD_NAVIGATION = [
  { label: 'Overview', to: '/', icon: 'dashboard' },
  { label: 'Accounts', to: '/accounts', icon: 'wallet' },
  { label: 'Transactions', to: '/transactions', icon: 'receipt' },
  { label: 'Portfolio', to: '/portfolio', icon: 'chart' },
  { label: 'Budgets', to: '/budgets', icon: 'budget' },
  { label: 'Goals', to: '/goals', icon: 'target' },
  { label: 'Reports', to: '/reports', icon: 'report' },
  { label: 'Profile', to: '/profile', icon: 'profile' },
]

export const QUICK_STATUSES = ['Stable cash flow', 'Healthy buffer', 'Goal on track'] as const