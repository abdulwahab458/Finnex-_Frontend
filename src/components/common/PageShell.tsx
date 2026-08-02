import type { ReactNode } from 'react'
import { ArrowLeft, Download, Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
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
  /** Set to true to render a back button that navigates to the previous page. */
  readonly showBackButton?: boolean
}

export function PageShell({
  title,
  subtitle,
  exportAction,
  createAction,
  actions,
  children,
  showBackButton = false,
}: Readonly<PageShellProps>) {
  const navigate = useNavigate();
  const hasHeaderText = Boolean(title || subtitle)
  const hasButtons = Boolean(exportAction || createAction || actions)

  return (
    <Section>
      {(hasHeaderText || hasButtons) && (
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between  slide-down">
          {hasHeaderText && (
            <div className="grid gap-1">
              {showBackButton && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex w-fit items-center gap-2 rounded-lg text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
                  aria-label="Go back"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}
              {title && (
                <h1 className="m-0 whitespace-nowrap text-[clamp(1.5rem,2vw,2.3rem)] font-semibold tracking-[-0.02em] text-on-surface">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="m-0 whitespace-nowrap text-lg   text-on-surface-variant">
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
                  className="flex items-center gap-2 rounded-[1rem] border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface shadow-soft transition-all duration-150 hover:-translate-y-px"
                >
                  <Download size={16} />
                  {exportAction.label}
                </button>
              )}
              {createAction && (
                <button
                  type="button"
                  onClick={createAction.onClick}
                  className="flex items-center gap-2 rounded-[1rem] bg-on-surface px-4 py-2.5 text-sm font-semibold text-surface shadow-soft transition-all duration-150 hover:-translate-y-px"
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