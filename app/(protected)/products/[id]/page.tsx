'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import { productsService } from '@/services/products.service';
import { Card, CardHeader, CardTitle, CardDescription, Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StockBadge } from '@/features/products/components/StockBadge';
import { useToast } from '@/components/shared/ToastProvider';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '' });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const {
    data: product,
    isLoading,
    error,
  } = useFetch(() => productsService.get(id), [id]);

  const { data: stockSummary } = useFetch(
    () => productsService.getStockSummary(),
    []
  );

  const stockItem = stockSummary?.items.find((i) => i.product_id === id);

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, sku: product.sku ?? '' });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Product name is required' });
      return;
    }
    setErrors({});
    setIsSaving(true);
    try {
      await productsService.update(id, {
        name: form.name.trim(),
        sku: form.sku.trim() || undefined,
      });
      showToast('Product updated', 'success');
      router.push('/products');
    } catch {
      showToast('Failed to update product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Card>
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-gray-700 font-semibold">Product not found</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/products')}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 truncate max-w-xs">{product.name}</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Stock info */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Stock</p>
              <p className="text-xs text-gray-400 mt-0.5">Real-time inventory level</p>
            </div>
            <StockBadge quantity={stockItem?.quantity ?? 0} />
          </div>
        </Card>

        {/* Edit form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Update the product information below</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-1">
            <Input
              label="Product Name"
              placeholder="e.g. Cotton T-Shirt"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={errors.name}
              required
            />

            <Input
              label="SKU"
              placeholder="e.g. SKU-001 (optional)"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              hint="Stock Keeping Unit — leave blank to clear"
            />

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/products')}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
