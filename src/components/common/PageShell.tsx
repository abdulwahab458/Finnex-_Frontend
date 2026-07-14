import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageShell({ title, subtitle, actions, children }: PageShellProps) {
  return (
    <section className="grid gap-4">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-success">Smart finance system</p>
          <h1 className="m-0 text-[clamp(1.5rem,2vw,2.3rem)] font-bold tracking-[-0.04em] text-on-surface">{title}</h1>
          {subtitle ? <p className="mt-1.5 max-w-2xl text-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </header>
      {children}
    </section>
  )
}