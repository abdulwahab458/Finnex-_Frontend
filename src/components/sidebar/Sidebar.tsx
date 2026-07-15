import { NavLink } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'
import type { NavigationItem } from '@/registry/navigation'

interface SidebarProps {
  items: NavigationItem[]
  basePath: string
}

interface SidebarNavItemProps {
  item: NavigationItem
  basePath: string
  depth?: number
}

function SidebarNavItem({ item, basePath, depth = 0 }: SidebarNavItemProps) {
  const Icon = item.icon
  const to = `${basePath}${item.path}`
  const paddingLeft = depth > 0 ? { paddingLeft: `${depth * 12 + 12}px` } : undefined

  if (item.children?.length) {
    return (
      <div className="grid gap-1">
        <div
          className="flex items-center gap-3 rounded-[10px]  px-3 py-3 text-sm font-semibold text-on-surface-variant"
          style={paddingLeft}
        >
          <Icon size={25} className="shrink-0" />
          {item.label}
         
        </div>
        <div className="grid gap-1">
          {item.children.map((child) => (
            <SidebarNavItem key={child.id} item={child} basePath={basePath} depth={depth + 1} />
          ))}
        </div>
      </div>
    )
  }

  if (item.disabled) {
    return (
      <span
        className="flex cursor-not-allowed rounded-[10px] items-center gap-3  px-3 py-3 text-sm font-medium text-on-surface-variant/50"
        style={paddingLeft}
      >
        <Icon size={25} className="shrink-0" />
        {item.label}
        
      </span>
    )
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-[10px] px-3 py-3 text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-surface-container text-on-surface shadow-soft'
            : 'text-on-surface-variant hover:-translate-y-px hover:bg-surface-container-low hover:text-on-surface',
        ].join(' ')
      }
      style={paddingLeft}
    >
      <Icon size={25} className="shrink-0" />
      {item.label}
      
    </NavLink>
  )
}

export function Sidebar({ items, basePath }: SidebarProps) {
  return (
    <aside className="sticky min-h-screen self-start  bg-[#f2f4f6] p-6 shadow-soft">
      <div className="mb-7 flex items-center gap-3 px-9 ">
        
        <div>
          <p className="m-0 text-2xl font-bold text-on-surface">{APP_NAME}</p>
          <p className="m-0 text-sm text-on-surface-variant font-semibold">Wealth Management</p>
        </div>
      </div>
      <nav className="grid gap-2">
        {items.map((item) => (
          <SidebarNavItem key={item.id} item={item} basePath={basePath} />
        ))}
      </nav>
    </aside>
  )
}
