import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const pageSize = initialPageSize;

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return { page, pageSize, goToPage, reset };
}
