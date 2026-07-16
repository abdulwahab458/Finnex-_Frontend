import type { ReactNode } from 'react'
import { Download, Plus } from 'lucide-react'
import { Section } from './Section'

interface PageAction {
  readonly label: string
  readonly onClick: () => void
}

interface PageShellProps {
  readonly title?: string
  readonly subtitle?: string
  readonly exportAction?: PageAction
  readonly createAction?: PageAction
  readonly actions?: ReactNode
  readonly children: ReactNode
}

export function PageShell({
  title,
  subtitle,
  exportAction,
  createAction,
  actions,
  children,
}: Readonly<PageShellProps>) {
  const hasHeaderText = Boolean(title || subtitle)
  const hasButtons = Boolean(exportAction || createAction || actions)

  return (
    <Section>
      {(hasHeaderText || hasButtons) && (
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {hasHeaderText && (
            <div className="grid gap-1">
              {title && (
                <h1 className="m-0 whitespace-nowrap text-[clamp(1.5rem,2vw,2.3rem)] font-bold tracking-[-0.03em] text-on-surface">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="m-0 whitespace-nowrap text-sm   text-on-surface-variant">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {hasButtons && (
            <div className="flex flex-wrap items-center gap-3">
              {exportAction && (
                <button
                  type="button"
                  onClick={exportAction.onClick}
                  className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface shadow-soft transition-all duration-150 hover:-translate-y-px"
                >
                  <Download size={16} />
                  {exportAction.label}
                </button>
              )}
              {createAction && (
                <button
                  type="button"
                  onClick={createAction.onClick}
                  className="flex items-center gap-2 rounded-md bg-on-surface px-4 py-2.5 text-sm font-semibold text-surface shadow-soft transition-all duration-150 hover:-translate-y-px"
                >
                  <Plus size={16} />
                  {createAction.label}
                </button>
              )}
              {actions}
            </div>
          )}
        </header>
      )}
      {children}
    </Section>
  )
}