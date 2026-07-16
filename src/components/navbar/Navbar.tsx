import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/lib/constants'
import { Bell, Search, Settings, User } from 'lucide-react'

export function Navbar() {
  // const { user, displayName, logout } = useAuth()

  return (
    <div className="mb-6 p-2 px-5 bg-surface-container-high flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-outline-variant bg-surface-searchbar px-5 py-3 shadow-soft">
        <Search size={20} className="shrink-0 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search accounts or data..."
          className="w-full bg-transparent text-sm font-medium text-on-surface placeholder:text-on-surface-variant focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-8">
        <button onClick={() => alert('Notifications clicked')}  >
          <Bell size={20} className="text-on-surface-variant" />
        </button>
        <button onClick={() => console.log('Settings clicked')}>
          <Settings size={20} className="text-on-surface-variant" />
        </button>
        <button onClick={() => console.log('Profile clicked')}>
          <User size={20} className="text-on-surface-variant" />
        </button>
      </div>
    </div>
  )
}
