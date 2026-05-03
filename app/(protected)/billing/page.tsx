'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { productsService } from '@/services/products.service';
import { billingService } from '@/services/billing.service';
import { toastService } from '@/lib/toast';
import { Button, Input, Card, CardHeader, CardTitle, Modal, Skeleton } from '@/components/ui';
import { Pagination } from '@/components/ui/Pagination';
import { InvoiceStatusBadge } from '@/features/billing/components/InvoiceStatusBadge';
import type { CartItem, Invoice, CreateInvoicePayload } from '@/types/billing.types';
import type { Product } from '@/types/products.types';

function fmtCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'invoices'>('new');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');
  const { page: invoicePage, pageSize, goToPage } = usePagination(1, 20);

  const { data: productsData, isLoading: productsLoading } = useFetch(
    () => productsService.list({ page: 1, page_size: 100 }),
    []
  );

  const { data: invoicesData, isLoading: invoicesLoading, refetch: refetchInvoices } = useFetch(
    () => billingService.listInvoices({ page: invoicePage, page_size: pageSize }),
    [invoicePage],
    { enabled: activeTab === 'invoices' }
  );

  const products: Product[] = productsData?.data ?? [];
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.sku ?? '').toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const actualTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.subtotal, 0),
    [cart]
  );
  const discountAmount = useMemo(
    () => Math.round((actualTotal * discountPercent) / 100 * 100) / 100,
    [actualTotal, discountPercent]
  );
  const finalTotal = actualTotal - discountAmount;

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unit_price }
            : i
        );
      }
      return [
        ...prev,
        { product_id: product.id, product_name: product.name, quantity: 1, unit_price: 0, subtotal: 0 },
      ];
    });
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product_id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product_id === productId
          ? { ...i, quantity: qty, subtotal: qty * i.unit_price }
          : i
      )
    );
  }, []);

  const updatePrice = useCallback((productId: string, price: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.product_id === productId
          ? { ...i, unit_price: price, subtotal: i.quantity * price }
          : i
      )
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product_id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountPercent(0);
    setSearch('');
  }, []);

  const handleGenerateBill = async () => {
    if (cart.length === 0) {
      toastService.error('Add at least one product to the cart');
      return;
    }

    setIsGenerating(true);
    try {
      const payload: CreateInvoicePayload = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        discount_percent: discountPercent,
        total_amount: actualTotal,
        discount_amount: discountAmount,
        final_amount: finalTotal,
      };
      const invoice = await billingService.createInvoice(payload);
      setGeneratedInvoice(invoice);
      toastService.success('Bill generated successfully!');
      clearCart();
    } catch {
      // Error handled by API interceptor
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Billing</h1>
          <p className="text-gray-500 text-sm mt-1">POS — create and manage invoices</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['new', 'invoices'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab === 'new' ? 'New Bill' : 'Invoices'}
          </button>
        ))}
      </div>

      {/* ── NEW BILL ── */}
      {activeTab === 'new' && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left: Product Search */}
          <div className="xl:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {filteredProducts.length} items
                </span>
              </CardHeader>
              <Input
                placeholder="Search by name or SKU…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftAddon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {productsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                ))
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No products found</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Add products first to start billing</p>
                  <Link href="/products/new">
                    <Button size="sm" variant="secondary">Add Product</Button>
                  </Link>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-blue-300 hover:shadow-md active:scale-[0.98] transition-all duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                    {product.sku && (
                      <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
                    )}
                    <div className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 py-1.5 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add to cart
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Cart */}
          <div className="xl:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cart</CardTitle>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear
                  </button>
                )}
              </CardHeader>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="text-3xl mb-2">🛒</div>
                  <p className="text-sm text-gray-500">Cart is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Click a product to add it</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product_id} className="bg-gray-50 rounded-xl p-3 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800 leading-tight flex-1">
                          {item.product_name}
                        </p>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium mb-1">Qty</p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQty(item.product_id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.product_id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium mb-1">Unit Price (₹)</p>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price || ''}
                            onChange={(e) => updatePrice(item.product_id, parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <p className="text-sm font-bold text-gray-900">{fmtCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Bill Summary */}
            {cart.length > 0 && (
              <Card>
                <CardTitle className="mb-4">Bill Summary</CardTitle>

                {/* Discount */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Discount %
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={discountPercent || ''}
                      onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      placeholder="0"
                      className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <span className="text-sm text-gray-500 font-medium">% off total bill</span>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-800">{fmtCurrency(actualTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600">Discount ({discountPercent}%)</span>
                      <span className="font-medium text-emerald-600">− {fmtCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-900">Total Payable</span>
                    <span className="text-xl font-bold text-blue-600">{fmtCurrency(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleGenerateBill}
                  isLoading={isGenerating}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  Generate Bill
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── INVOICES ── */}
      {activeTab === 'invoices' && (
        <Card padding="none">
          <div className="px-6 py-4 border-b border-gray-100">
            <CardTitle>Invoice History</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Invoice ID', 'Status', 'Amount', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {invoicesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-5 py-3.5">
                          <div className="h-4 animate-shimmer rounded-md" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (invoicesData?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">No invoices yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (invoicesData?.data ?? []).map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{inv.id.slice(0, 8)}…</td>
                      <td className="px-5 py-3.5"><InvoiceStatusBadge status={inv.status} /></td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">
                        {inv.final_amount != null ? fmtCurrency(inv.final_amount) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{fmtDate(inv.created_at)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/billing/${inv.id}`}>
                            <Button size="sm" variant="ghost">View</Button>
                          </Link>
                          {inv.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={async () => {
                                try {
                                  await billingService.markAsPaid(inv.id);
                                  toastService.success('Invoice marked as paid');
                                  refetchInvoices();
                                } catch {}
                              }}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {invoicesData?.pagination && (
            <div className="px-5">
              <Pagination meta={invoicesData.pagination} onPageChange={goToPage} />
            </div>
          )}
        </Card>
      )}

      {/* ── Generated Bill Modal ── */}
      <Modal
        isOpen={generatedInvoice !== null}
        onClose={() => setGeneratedInvoice(null)}
        title="Bill Generated"
        size="md"
      >
        {generatedInvoice && (
          <div className="space-y-5">
            {/* Header */}
            <div className="text-center pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-bold text-gray-900">Invoice #{generatedInvoice.id.slice(0, 8)}</p>
              <InvoiceStatusBadge status={generatedInvoice.status} />
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(generatedInvoice.id)}`}
                alt="Bill QR code"
                width={120}
                height={120}
                className="rounded-xl border border-gray-200 p-2 bg-white"
              />
            </div>

            {/* Amounts */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {generatedInvoice.total_amount != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{fmtCurrency(generatedInvoice.total_amount)}</span>
                </div>
              )}
              {generatedInvoice.discount_amount != null && generatedInvoice.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600">Discount ({generatedInvoice.discount_percent ?? 0}%)</span>
                  <span className="text-emerald-600 font-medium">− {fmtCurrency(generatedInvoice.discount_amount)}</span>
                </div>
              )}
              {generatedInvoice.final_amount != null && (
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total Paid</span>
                  <span className="text-blue-600">{fmtCurrency(generatedInvoice.final_amount)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={handlePrint}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
              <Link href={`/billing/${generatedInvoice.id}`} className="flex-1">
                <Button className="w-full">View Invoice</Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
