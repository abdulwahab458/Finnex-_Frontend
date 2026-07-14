import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classNames } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  children: ReactNode
}

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-bold transition-all duration-150 hover:-translate-y-px',
        variant === 'primary'
          ? 'bg-primary text-on-primary shadow-soft hover:shadow-card'
          : 'border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-low',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}