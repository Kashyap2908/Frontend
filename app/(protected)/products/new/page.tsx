'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsService } from '@/services/products.service';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/shared/ToastProvider';

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '' });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Product name is required' });
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await productsService.create({
        name: form.name.trim(),
        sku: form.sku.trim() || undefined,
      });
      showToast('Product created successfully', 'success');
      router.push('/products');
    } catch {
      showToast('Failed to create product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold text-gray-900">Add Product</h1>
          <p className="text-sm text-gray-500">Create a new product in your catalogue</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Fill in the information for the new product</CardDescription>
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
            hint="Stock Keeping Unit — leave blank to skip"
          />

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Create Product
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/products')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
