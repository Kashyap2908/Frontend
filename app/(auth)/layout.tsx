import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication — Neuro Stock',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">Neuro Stock</h1>
          <p className="text-gray-500 mt-1 text-sm">ERP &amp; Inventory Management System</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
