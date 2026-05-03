'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { productsService } from '@/services/products.service';
import {
  Card, CardHeader, CardTitle, Skeleton, Pagination,
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StockBadge } from '@/features/products/components/StockBadge';
import { useToast } from '@/components/shared/ToastProvider';
import type { StockSummaryItem } from '@/types/products.types';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProductsPage() {
  const { showToast } = useToast();
  const { page, pageSize, goToPage } = usePagination(1, 20);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    data: productsEnvelope,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useFetch(
    () => productsService.list({ page, page_size: pageSize, search: search || undefined }),
    [page, pageSize, search]
  );

  const { data: stockSummary, isLoading: stockLoading } = useFetch(
    () => productsService.getStockSummary(),
    []
  );

  const products = productsEnvelope?.data ?? [];
  const stockMap: Record<string, StockSummaryItem> = {};
  (stockSummary?.items ?? []).forEach((item) => {
    stockMap[item.product_id] = item;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await productsService.delete(id);
      showToast('Product deleted', 'success');
      setConfirmDelete(null);
      refetchProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalogue and inventory</p>
        </div>
        <Link href="/products/new">
          <Button variant="primary" size="sm">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Products',
            value: stockLoading ? null : (stockSummary?.total_products ?? 0),
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ),
            bg: 'bg-blue-50',
            color: 'text-blue-600',
          },
          {
            label: 'Low Stock',
            value: stockLoading ? null : (stockSummary?.low_stock_count ?? 0),
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ),
            bg: 'bg-amber-50',
            color: 'text-amber-600',
          },
          {
            label: 'Total Stock Value',
            value: stockLoading ? null : ('₹' + (stockSummary?.total_stock_value ?? 0).toLocaleString('en-IN')),
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            bg: 'bg-emerald-50',
            color: 'text-emerald-600',
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-3 tabular-nums tracking-tight">
              {stat.value === null ? <Skeleton className="h-7 w-16 mt-1" /> : stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Product list */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); goToPage(1); }}
            />
          </div>
        </CardHeader>

        {productsLoading ? (
          <div className="space-y-3 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No products found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search or add a new product</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-5 font-semibold text-gray-600">Product</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 hidden sm:table-cell">SKU</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 hidden md:table-cell">Added</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600">Stock</th>
                    <th className="text-right py-3 px-5 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stock = stockMap[product.id];
                    return (
                      <tr
                        key={product.id}
                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-gray-500 hidden sm:table-cell">
                          {product.sku ?? <span className="text-gray-300">—</span>}
                        </td>
                        <td className="py-3.5 px-5 text-gray-500 hidden md:table-cell">
                          {fmtDate(product.created_at)}
                        </td>
                        <td className="py-3.5 px-5">
                          <StockBadge quantity={stock?.quantity ?? 0} />
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/products/${product.id}`}>
                              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </Link>
                            {confirmDelete === product.id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-gray-500">Sure?</span>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  disabled={deletingId === product.id}
                                  className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                                >
                                  {deletingId === product.id ? '…' : 'Yes'}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(product.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {productsEnvelope?.pagination && (
              <div className="mt-4">
                <Pagination
                  meta={productsEnvelope.pagination}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
