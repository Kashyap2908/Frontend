import type { PaginationMeta } from '@/types/api.types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, total_pages, has_prev, has_next, total, page_size } = meta;

  if (total_pages <= 1) return null;

  const from = (page - 1) * page_size + 1;
  const to = Math.min(page * page_size, total);

  return (
    <div className="flex items-center justify-between px-1 py-3 border-t border-gray-100 mt-1">
      <p className="text-sm text-gray-500">
        Showing{' '}
        <span className="font-semibold text-gray-700">
          {from}–{to}
        </span>{' '}
        of <span className="font-semibold text-gray-700">{total}</span> results
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!has_prev}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700 px-2 tabular-nums">
          {page} / {total_pages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!has_next}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
