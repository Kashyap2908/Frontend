import type { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
}

export function Table<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available.',
  keyExtractor,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm ring-1 ring-gray-900/[0.04]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-50/90 border-b border-gray-100 backdrop-blur-sm">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={[
                  'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap',
                  col.className ?? '',
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3.5">
                      <div className="h-4 animate-shimmer rounded-md" />
                    </td>
                  ))}
                </tr>
              ))
            : data.length === 0
              ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-14 text-center">
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">{emptyMessage}</p>
                      </div>
                    </td>
                  </tr>
                )
              : data.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    className="hover:bg-slate-50/60 transition-colors duration-100"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={['px-4 py-3.5 text-gray-800', col.className ?? ''].join(' ')}
                      >
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
}
