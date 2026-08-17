import { useState } from 'react'
import { PageShell } from '@/components/common/PageShell'
import {
  AlertTriangle,
  ArrowDownLeft,
  BellRing,
  Check,
  CheckCheck,
  Gift,
  Info,
  PiggyBank,
  Shield,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NotificationType = 'transaction' | 'alert' | 'goal' | 'security' | 'promotion' | 'system'

interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

const typeConfig: Record<NotificationType, { icon: typeof Info; iconClass: string }> = {
  transaction: { icon: ArrowDownLeft, iconClass: 'bg-[#e5f4f0] text-success' },
  alert: { icon: AlertTriangle, iconClass: 'bg-[#fdecec] text-red-600' },
  goal: { icon: PiggyBank, iconClass: 'bg-[#fff7e6] text-warning' },
  security: { icon: Shield, iconClass: 'bg-[#e8ecff] text-indigo-600' },
  promotion: { icon: Gift, iconClass: 'bg-[#f5e9ff] text-purple-600' },
  system: { icon: Info, iconClass: 'bg-surface-container-low text-on-surface-variant' },
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'transaction',
    title: 'Salary deposit received',
    message: 'Your monthly salary of $5,400.00 has been credited to your Checking account.',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'alert',
    title: 'Budget limit reached',
    message: 'Your "Food & Dining" budget has reached 95% of its monthly limit of $500.00.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'security',
    title: 'New login detected',
    message: 'A new login to your account was detected from Chrome on Windows. If this was you, no action is needed.',
    time: '3 hours ago',
    read: false,
  },
  {
    id: 4,
    type: 'goal',
    title: 'Savings goal progress',
    message: 'Great news! Your "Emergency Fund" goal is now 75% funded. Keep it up!',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 5,
    type: 'transaction',
    title: 'Payment sent',
    message: 'You sent $250.00 to Sarah Mitchell via instant transfer.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 6,
    type: 'promotion',
    title: 'Exclusive cashback offer',
    message: 'Earn up to 3% cashback on grocery purchases this month. Limited time offer!',
    time: '2 days ago',
    read: true,
  },
  {
    id: 7,
    type: 'system',
    title: 'Platform update',
    message: 'Modern Trust is rolling out new features including enhanced portfolio analytics.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 8,
    type: 'alert',
    title: 'Unusual spending detected',
    message: 'We noticed spending 40% higher than your typical weekly pattern in Entertainment.',
    time: '4 days ago',
    read: true,
  },
  {
    id: 9,
    type: 'transaction',
    title: 'Refund processed',
    message: 'A refund of $78.50 from Amazon has been credited to your Credit account.',
    time: '5 days ago',
    read: true,
  },
  {
    id: 10,
    type: 'goal',
    title: 'Goal reached',
    message: 'Congratulations! Your "Travel" goal has been fully funded. Time to celebrate.',
    time: '1 week ago',
    read: true,
  },
]

type Filter = 'all' | 'unread' | 'transaction' | 'alert' | 'goal' | 'security' | 'promotion' | 'system'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'transaction', label: 'Transactions' },
  { id: 'alert', label: 'Alerts' },
  { id: 'goal', label: 'Goals' },
  { id: 'security', label: 'Security' },
  { id: 'promotion', label: 'Offers' },
  { id: 'system', label: 'System' },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<Filter>('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const filtered =
    filter === 'all'
      ? notifications
      : filter === 'unread'
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter)

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const toggleRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    )

  const removeNotification = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  return (
    <PageShell
      title="Notifications"
      subtitle="Stay up to date with your account activity"
      actions={
        <button
          type="button"
          onClick={markAllAsRead}
          className="flex items-center gap-2 rounded-[1rem] border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface shadow-soft transition-all duration-150 hover:-translate-y-px"
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      }
    >
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150',
              filter === f.id
                ? 'bg-on-surface text-surface shadow-soft'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
            )}
          >
            {f.label}
            {f.id === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="mt-6 grid gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-outline/30 bg-surface py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant">
              <BellRing size={22} />
            </div>
            <div>
              <p className="font-semibold text-on-surface">No notifications</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                You&apos;re all caught up for this filter.
              </p>
            </div>
          </div>
        ) : (
          filtered.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon
            return (
              <div
                key={notification.id}
                className={cn(
                  'group flex flex-col gap-3 rounded-[1.2rem] border bg-surface p-4 shadow-soft transition-all duration-150 sm:flex-row sm:items-start',
                  notification.read
                    ? 'border-outline/20'
                    : 'border-on-surface/10 shadow-card',
                )}
              >
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', config.iconClass)}>
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 font-semibold text-on-surface">
                      {notification.title}
                      {!notification.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-indigo-600" aria-label="Unread" />
                      )}
                    </p>
                    
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {notification.message}
                  </p>
                </div>

                <div className="flex   shrink-0 items-center gap-1 sm:flex-col">
                  <span className="shrink-0 text-xs font-medium text-on-surface-variant">
                      {notification.time}
                    </span>
                  <div className="flex">
                  <button
                    type="button"
                    onClick={() => toggleRead(notification.id)}
                    aria-label={notification.read ? 'Mark as unread' : 'Mark as read'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNotification(notification.id)}
                    aria-label="Delete notification"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-[#fdecec] hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </PageShell>
  )
}
