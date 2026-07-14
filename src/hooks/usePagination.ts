import { useMemo, useState } from 'react'

export function usePagination(totalItems: number, pageSize = 10) {
  const [page, setPage] = useState(1)

  const pageCount = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [pageSize, totalItems])

  const nextPage = () => setPage((currentPage) => Math.min(currentPage + 1, pageCount))
  const previousPage = () => setPage((currentPage) => Math.max(currentPage - 1, 1))

  return {
    page,
    pageCount,
    pageSize,
    nextPage,
    previousPage,
    setPage,
    canGoNext: page < pageCount,
    canGoPrevious: page > 1,
  }
}