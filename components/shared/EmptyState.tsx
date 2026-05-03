import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'No data',
  message = 'Nothing to display here yet.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center mb-5 shadow-sm">
        {icon ?? (
          <svg
            className="w-7 h-7 text-gray-400"
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
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 mb-7 max-w-xs leading-relaxed">{message}</p>
      {action}
    </div>
  );
}
