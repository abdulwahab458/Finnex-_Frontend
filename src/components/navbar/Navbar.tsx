import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/lib/constants'

export function Navbar() {
  const { user, displayName, logout } = useAuth()

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="grid gap-1">
        <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-success">{APP_NAME}</p>
        <h1 className="m-0 text-[clamp(2rem,3vw,3.25rem)] font-bold leading-none tracking-[-0.04em] text-on-surface">
          Wealth management command center
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-md border border-outline-variant bg-surface-container px-4 py-3 text-sm font-medium text-on-surface-variant shadow-soft">
          {user ? `Signed in as ${displayName}` : 'Demo session active'}
        </div>
        <Button variant="ghost" type="button" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
