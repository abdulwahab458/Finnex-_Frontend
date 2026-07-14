import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <section className="grid gap-5 text-on-surface">
      <div className="space-y-2">
        <h2 className="m-0  font-bold font-serif tracking-[-0.04em] text-on-surface sm:text-[1.8rem]">{title}</h2>
        <p className="m-0 text-sm leading-6 text-on-surface-variant">{description}</p>
      </div>
      {children}
    </section>
  )
}