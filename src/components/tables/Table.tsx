import type { ReactNode } from 'react'

// ============ Root ============
interface TableRootProps {
  readonly children: ReactNode
  readonly className?: string
}

function Root({ children, className }: Readonly<TableRootProps>) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-outline/30 bg-surface shadow-card ${className ?? ''}`}>
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  )
}

// ============ Header ============
interface TableHeaderProps {
  readonly children: ReactNode
}

function Header({ children }: Readonly<TableHeaderProps>) {
  return (
    <thead className="bg-[#f2f4f6]">
      <tr>{children}</tr>
    </thead>
  )
}

interface TableHeaderCellProps {
  readonly children: ReactNode
  readonly align?: 'left' | 'center' | 'right'
  readonly className?: string
}

function HeaderCell({ children, align = 'left', className }: Readonly<TableHeaderCellProps>) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  return (
    <th
      className={`px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#44474d]  ${alignClass} ${className ?? ''}`}
    >
      {children}
    </th>
  )
}

// ============ Body ============
interface TableBodyProps {
  readonly children: ReactNode
}

function Body({ children }: Readonly<TableBodyProps>) {
  return <tbody className="divide-y divide-outline-variant">{children}</tbody>
}

// ============ Row ============
interface TableRowProps {
  readonly children: ReactNode
  readonly className?: string
}

function Row({ children, className }: Readonly<TableRowProps>) {
  return (
    <tr className={`transition-colors duration-150 hover:bg-surface-container-low ${className ?? ''}`}>
      {children}
    </tr>
  )
}

// ============ Cell ============
interface TableCellProps {
  readonly children: ReactNode
  readonly align?: 'left' | 'center' | 'right'
  readonly className?: string
}

function Cell({ children, align = 'left', className }: Readonly<TableCellProps>) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  return (
    <td className={`px-6 py-4 text-sm text-on-surface ${alignClass} ${className ?? ''}`}>
      {children}
    </td>
  )
}

// ============ Export as compound component ============
export const Table = {
  Root,
  Header,
  HeaderCell,
  Body,
  Row,
  Cell,
}