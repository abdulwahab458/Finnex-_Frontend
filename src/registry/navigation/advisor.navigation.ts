import { LayoutDashboard, Users, CalendarDays, MessageSquare, UserCircle } from 'lucide-react'
import type { NavigationItem } from './types'

export const advisorNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: Users,
    path: '/clients',
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: CalendarDays,
    path: '/appointments',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    path: '/messages',
    badge: '3',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircle,
    path: '/profile',
  },
]
