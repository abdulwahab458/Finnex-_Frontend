import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ============ Pagination ============
export interface TablePaginationProps {
  readonly currentPage: number
  readonly totalPages: number
  readonly onPageChange: (page: number) => void
  readonly previousLabel?: string
  readonly nextLabel?: string
  readonly className?: string
}

/**
 * Builds a compact page list with ellipses, e.g. for page 1 of 12:
 * [1, 2, 3, "…", 12]  — always keeps the first and last page visible,
 * plus a window of pages around the current one, and collapses the
 * rest into a single "…".
 */
function getPageNumbers(current: number, total: number): Array<number | 'ellipsis'> {
  const siblingCount = 2
  if (total <= 1) return total === 1 ? [1] : []

  const pages: Array<number | 'ellipsis'> = [1]

  const rangeStart = Math.max(2, current - siblingCount)
  const rangeEnd = Math.min(total - 1, current + siblingCount)

  if (rangeStart > 2) pages.push('ellipsis')
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
  if (rangeEnd < total - 1) pages.push('ellipsis')

  if (total > 1) pages.push(total)

  return pages
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
}: Readonly<TablePaginationProps>) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)
  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-outline/30 bg-[#f2f4f6] px-6 py-3',
        className
      )}
    >
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
          isFirst
            ? 'cursor-not-allowed border-outline/30 bg-surface text-on-surface-variant/50'
            : 'border-outline/30 bg-surface text-on-surface hover:bg-surface-container-low'
        )}
      >
        {previousLabel}
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-sm text-on-surface-variant">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
                page === currentPage
                  ? 'bg-on-surface text-surface'
                  : 'text-warning hover:bg-surface'
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
          isLast
            ? 'cursor-not-allowed border-outline/30 bg-surface text-on-surface-variant/50'
            : 'border-outline/30 bg-surface text-on-surface hover:bg-surface-container-low'
        )}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ============ Root ============
interface TableRootProps {
  readonly children: ReactNode
  readonly className?: string
  /** Pass to render the pagination footer, styled to match the header bg.
   *  Omit entirely and no footer renders — pagination is fully opt-in. */
  readonly pagination?: TablePaginationProps
}

function Root({ children, className, pagination }: Readonly<TableRootProps>) {
  return (
    <div className={cn('overflow-hidden rounded-3xl border border-outline/30 bg-surface shadow-card slide-down', className)}>
      <table className="w-full border-collapse text-left">{children}</table>
      {pagination && <Pagination {...pagination} />}
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
      className={`px-6 py-3  font-semibold uppercase tracking-[0.01em] text-[#44474d]  ${alignClass} ${className ?? ''}`}
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
  Pagination,
}