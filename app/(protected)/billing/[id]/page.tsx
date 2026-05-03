'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { billingService } from '@/services/billing.service';
import { Card, CardHeader, CardTitle, CardDescription, Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusBadge } from '@/features/billing/components/InvoiceStatusBadge';
import { useToast } from '@/components/shared/ToastProvider';

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
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

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [markingPaid, setMarkingPaid] = useState(false);

  const {
    data: invoice,
    isLoading,
    error,
    refetch,
  } = useFetch(() => billingService.getInvoice(id), [id]);

  const handleMarkPaid = async () => {
    if (!invoice || invoice.status === 'paid') return;
    setMarkingPaid(true);
    try {
      await billingService.markAsPaid(id);
      showToast('Invoice marked as paid', 'success');
      refetch();
    } catch {
      showToast('Failed to update invoice', 'error');
    } finally {
      setMarkingPaid(false);
    }
  };

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Card>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-gray-700 font-semibold">Invoice not found</p>
        <p className="text-gray-400 text-sm mt-1">This invoice may have been deleted or does not exist.</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push('/billing')}>
          Back to Billing
        </Button>
      </div>
    );
  }

  const items = invoice.items ?? [];
  const qrData = encodeURIComponent(`INV-${invoice.id} | ₹${invoice.final_amount ?? 0}`);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/billing')}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invoice #{invoice.id.slice(0, 8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">{fmtDate(invoice.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <Button
              onClick={handleMarkPaid}
              isLoading={markingPaid}
              variant="primary"
              size="sm"
            >
              Mark as Paid
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </Button>
        </div>
      </div>

      {/* Invoice card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main invoice */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            {/* Invoice meta */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900">Neuro Stock ERP</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Invoice #{invoice.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{fmtDate(invoice.created_at)}</p>
              </div>
              <InvoiceStatusBadge status={invoice.status} />
            </div>

            {/* Items table */}
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-5 font-semibold text-gray-600">Product</th>
                    <th className="text-right py-3 px-5 font-semibold text-gray-600">Qty</th>
                    <th className="text-right py-3 px-5 font-semibold text-gray-600">Unit Price</th>
                    <th className="text-right py-3 px-5 font-semibold text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                        No items recorded
                      </td>
                    </tr>
                  ) : (
                    items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-5 font-medium text-gray-800">{item.product_name}</td>
                        <td className="py-3.5 px-5 text-right text-gray-600">{item.quantity}</td>
                        <td className="py-3.5 px-5 text-right text-gray-600 tabular-nums">{fmt(item.unit_price)}</td>
                        <td className="py-3.5 px-5 text-right font-semibold text-gray-900 tabular-nums">{fmt(item.subtotal)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{fmt(invoice.total_amount ?? 0)}</span>
                </div>
                {(invoice.discount_percent ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({invoice.discount_percent}%)</span>
                    <span className="tabular-nums">− {fmt(invoice.discount_amount ?? 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="tabular-nums">{fmt(invoice.final_amount ?? 0)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: QR + info */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Scan to verify invoice</CardDescription>
            </CardHeader>
            <div className="flex justify-center py-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}`}
                alt="Invoice QR"
                className="rounded-xl border border-gray-100 shadow-sm"
                width={160}
                height={160}
              />
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              {invoice.id.slice(0, 8).toUpperCase()}
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items</span>
                <span className="font-medium text-gray-800">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800 tabular-nums">{fmt(invoice.total_amount ?? 0)}</span>
              </div>
              {(invoice.discount_percent ?? 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600 tabular-nums">−{fmt(invoice.discount_amount ?? 0)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-semibold text-gray-700">Total Due</span>
                <span className="text-base font-bold text-gray-900 tabular-nums">{fmt(invoice.final_amount ?? 0)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
