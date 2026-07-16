import type { ReactNode } from 'react'
import { cn  } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  className?: string
}

export function Section({ children, className }: Readonly<SectionProps> ) {
  return (
    <section className={cn('min-h-screen bg-surface px-8 py-4', className)}>
      {children}
    </section>
  )
}