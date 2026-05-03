'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardHeader, CardTitle, CardDescription, Skeleton } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import type { DailyStat } from '@/types/analytics.types';

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

function fmtShort(n: number) {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
  return '₹' + n.toLocaleString('en-IN');
}

function BarChart({ data }: { data: DailyStat[] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-sm text-gray-400">
      No data available for this period
    </div>
  );

  const maxRev = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-2">
      {data.map((d) => {
        const heightPct = (d.revenue / maxRev) * 100;
        const date = new Date(d.date);
        const label = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        return (
          <div
            key={d.date}
            className="flex flex-col items-center gap-1.5 flex-1 min-w-[28px] group"
            title={`${label}: ${fmt(d.revenue)} (${d.transactions} txns)`}
          >
            <div
              className="w-full rounded-t-md bg-blue-500 group-hover:bg-blue-600 transition-all duration-200 min-h-[4px] relative"
              style={{ height: `${Math.max(heightPct, 4)}%` }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {fmtShort(d.revenue)}
              </div>
            </div>
            <span className="text-[10px] text-gray-400 rotate-45 origin-left whitespace-nowrap hidden sm:block">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(today);

  const { data: sales, isLoading: salesLoading } = useFetch(
    () => analyticsService.getSalesReport({ date_from: dateFrom, date_to: dateTo }),
    [dateFrom, dateTo]
  );

  const { data: stock, isLoading: stockLoading } = useFetch(
    () => analyticsService.getStockReport(),
    []
  );

  const dailyData = sales?.daily_data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Sales and inventory performance insights</p>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
          />
        </div>
      </div>

      {/* Sales KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: sales?.total_revenue,
            render: (v: number) => fmt(v),
            icon: '💰',
            bg: 'bg-blue-50',
          },
          {
            label: 'Transactions',
            value: sales?.total_transactions,
            render: (v: number) => v.toLocaleString(),
            icon: '🧾',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Paid Amount',
            value: sales?.paid_amount,
            render: (v: number) => fmt(v),
            icon: '✅',
            bg: 'bg-green-50',
          },
          {
            label: 'Unpaid Amount',
            value: sales?.unpaid_amount,
            render: (v: number) => fmt(v),
            icon: '⏳',
            bg: 'bg-amber-50',
          },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center text-lg mb-3`}>
              {kpi.icon}
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.label}</p>
            {salesLoading ? (
              <Skeleton className="h-7 w-24 mt-2" />
            ) : (
              <p className="text-xl font-bold text-gray-900 tabular-nums mt-1">
                {kpi.value !== undefined ? kpi.render(kpi.value) : '—'}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
          <CardDescription>
            {dateFrom} — {dateTo}
          </CardDescription>
        </CardHeader>

        {salesLoading ? (
          <div className="flex items-end gap-1.5 h-48 mt-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gray-100 animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
            ))}
          </div>
        ) : (
          <BarChart data={dailyData} />
        )}
      </Card>

      {/* Stock overview + low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock summary */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Overview</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {[
              {
                label: 'Total Products',
                value: stockLoading ? null : (stock?.total_products ?? 0).toLocaleString(),
              },
              {
                label: 'Total Stock Value',
                value: stockLoading ? null : fmt(stock?.total_stock_value ?? 0),
              },
              {
                label: 'Low Stock Items',
                value: stockLoading ? null : (stock?.low_stock_items?.length ?? 0).toLocaleString(),
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{row.label}</span>
                {row.value === null ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <span className="text-sm font-semibold text-gray-900 tabular-nums">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Low stock table */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Items at or below threshold</CardDescription>
          </CardHeader>

          {stockLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : !stock?.low_stock_items?.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardDescription>All items are well-stocked</CardDescription>
            </div>
          ) : (
            <ul className="space-y-1 -mx-1">
              {stock.low_stock_items.map((item) => (
                <li
                  key={item.product_id}
                  className="flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">{item.product_name}</span>
                  </div>
                  <Badge variant={item.quantity === 0 ? 'danger' : 'warning'}>
                    {item.quantity === 0 ? 'Out of stock' : `${item.quantity} left`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
