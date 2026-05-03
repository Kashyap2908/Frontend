import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication — Neuro Stock',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative background blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[420px] animate-fade-in-scale">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Neuro Stock</h1>
          <p className="text-blue-300/70 mt-1.5 text-sm">ERP &amp; Inventory Management System</p>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/25 border border-white/10 ring-1 ring-inset ring-white/5 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
