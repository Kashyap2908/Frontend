'use client';

import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardHeader, CardTitle, Skeleton, Pagination } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';

function getActionLabel(action: string): string {
  const map: Record<string, string> = {
    login_success: 'User signed in',
    login_failed: 'Failed login attempt',
    register: 'New user registered',
    logout: 'User signed out',
    product_created: 'Product created',
    product_updated: 'Product updated',
    product_deleted: 'Product deleted',
    invoice_created: 'Invoice generated',
    invoice_paid: 'Invoice marked paid',
    transaction_created: 'Transaction recorded',
    transaction_voided: 'Transaction voided',
    stock_updated: 'Stock updated',
  };
  return map[action] ?? action.replace(/_/g, ' ');
}

function getActionBadge(action: string) {
  if (action.includes('failed') || action.includes('error')) return 'danger' as const;
  if (action.includes('created') || action.includes('register')) return 'success' as const;
  if (action.includes('deleted') || action.includes('voided')) return 'warning' as const;
  return 'neutral' as const;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ActivityPage() {
  const { page, pageSize, goToPage } = usePagination(1, 20);

  const { data: envelope, isLoading } = useFetch(
    () => analyticsService.getActivityLogs({ page, page_size: pageSize }),
    [page, pageSize]
  );

  const logs = envelope?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Activity Log</h1>
        <p className="text-gray-500 text-sm mt-1">Full audit trail of all system actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activity</CardTitle>
          {envelope?.pagination && (
            <p className="text-sm text-gray-400">
              {envelope.pagination.total.toLocaleString()} total entries
            </p>
          )}
        </CardHeader>

        {isLoading ? (
          <div className="space-y-3 mt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No activity recorded yet</p>
          </div>
        ) : (
          <>
            <ul className="space-y-0.5 -mx-2 mt-2">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {getActionLabel(log.action)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {log.entity_type && (
                        <span className="text-xs text-gray-400 capitalize">{log.entity_type}</span>
                      )}
                      {log.ip_address && (
                        <span className="text-xs text-gray-300">· {log.ip_address}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={getActionBadge(log.action)}>
                      {log.action.split('_')[0]}
                    </Badge>
                    <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                      {fmtDate(log.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {envelope?.pagination && (
              <div className="mt-4">
                <Pagination meta={envelope.pagination} onPageChange={goToPage} />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
