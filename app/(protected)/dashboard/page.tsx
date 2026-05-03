'use client';

import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardHeader, CardTitle, CardDescription, Skeleton } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import type { ActivityLog } from '@/types/activity.types';

function fmt(n: number) {
  return n.toLocaleString();
}

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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const stats = [
  {
    label: 'Total Sales',
    key: 'total_sales' as const,
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Transactions',
    key: 'total_transactions' as const,
    bgClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'Low Stock Items',
    key: 'low_stock_items' as const,
    bgClass: 'bg-amber-50',
    iconClass: 'text-amber-600',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
] as const;

const quickActions = [
  { label: 'Create Bill', href: '/billing', icon: '🧾', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
  { label: 'Add Product', href: '/products/new', icon: '📦', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
  { label: 'View Reports', href: '/analytics', icon: '📊', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
];

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useFetch(
    () => analyticsService.getDashboard(),
    []
  );

  const { data: activityData, isLoading: activityLoading } = useFetch(
    () => analyticsService.getActivityLogs({ page: 1, page_size: 8 }),
    []
  );

  const activities: ActivityLog[] = activityData?.data ?? [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your inventory and operations</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            {summaryLoading ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgClass}`}>
                    <span className={stat.iconClass}>{stat.icon}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
                  {fmt(summary?.[stat.key] ?? 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">All time</p>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${action.color}`}
            >
              <span>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <Link
            href="/activity"
            className="text-xs text-blue-600 font-medium hover:underline"
          >
            View all
          </Link>
        </CardHeader>

        {activityLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <CardDescription>No recent activity yet.</CardDescription>
          </div>
        ) : (
          <ul className="space-y-1 -mx-2">
            {activities.map((log) => (
              <li
                key={log.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {getActionLabel(log.action)}
                  </p>
                  {log.entity_type && (
                    <p className="text-xs text-gray-400 truncate capitalize">
                      {log.entity_type}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={getActionBadge(log.action)}>
                    {log.action.split('_')[0]}
                  </Badge>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {timeAgo(log.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
