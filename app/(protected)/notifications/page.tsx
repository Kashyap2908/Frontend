'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { notificationsService } from '@/services/notifications.service';
import { Card, CardHeader, CardTitle, Skeleton, Pagination } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/shared/ToastProvider';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { showToast } = useToast();
  const { page, pageSize, goToPage } = usePagination(1, 20);
  const [markingAll, setMarkingAll] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const { data: envelope, isLoading, refetch } = useFetch(
    () => notificationsService.list({ page, page_size: pageSize }),
    [page, pageSize]
  );

  const notifications = envelope?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read && !readIds.has(n.id)).length;

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setReadIds((prev) => new Set([...prev, id]));
    } catch {
      showToast('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationsService.markAllAsRead();
      showToast('All notifications marked as read', 'success');
      refetch();
    } catch {
      showToast('Failed to mark all as read', 'error');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            isLoading={markingAll}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          {envelope?.pagination && (
            <p className="text-sm text-gray-400">
              {envelope.pagination.total.toLocaleString()} total
            </p>
          )}
        </CardHeader>

        {isLoading ? (
          <div className="space-y-3 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-1 py-2">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full max-w-sm" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">You'll see alerts and updates here</p>
          </div>
        ) : (
          <>
            <ul className="space-y-0 -mx-2 mt-2 divide-y divide-gray-50">
              {notifications.map((notif) => {
                const isRead = notif.is_read || readIds.has(notif.id);
                return (
                  <li
                    key={notif.id}
                    className={[
                      'flex items-start gap-3 px-3 py-3.5 rounded-lg transition-colors',
                      isRead ? 'hover:bg-gray-50/60' : 'bg-blue-50/40 hover:bg-blue-50/70',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                        isRead ? 'bg-gray-100' : 'bg-blue-100',
                      ].join(' ')}
                    >
                      <svg
                        className={['w-4 h-4', isRead ? 'text-gray-400' : 'text-blue-600'].join(' ')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={['text-sm', isRead ? 'text-gray-600' : 'text-gray-800 font-medium'].join(' ')}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.created_at)}</p>
                    </div>

                    {!isRead && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="shrink-0 mt-1 p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors"
                        title="Mark as read"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </li>
                );
              })}
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
