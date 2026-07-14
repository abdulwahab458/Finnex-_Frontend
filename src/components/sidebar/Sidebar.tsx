import { NavLink } from 'react-router-dom'
import { DASHBOARD_NAVIGATION, APP_NAME } from '@/lib/constants'

export function Sidebar() {
  return (
    <aside className="sticky top-6 self-start rounded-md border border-outline-variant bg-surface-container p-6 shadow-soft">
      <div className="mb-7 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-[0.85rem] font-bold tracking-[0.06em] text-on-primary shadow-soft">
          SF
        </div>
        <div>
          <p className="m-0 text-base font-bold text-on-surface">{APP_NAME}</p>
          <p className="m-0 text-sm text-on-surface-variant">Finance operations suite</p>
        </div>
      </div>
      <nav className="grid gap-2">
        {DASHBOARD_NAVIGATION.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              [
                'rounded-md px-3 py-3 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-surface-container-high text-on-surface shadow-soft'
                  : 'text-on-surface-variant hover:-translate-y-px hover:bg-surface-container-low hover:text-on-surface',
              ].join(' ')
            }
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}