'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/billing': 'Billing',
  '/products': 'Products',
  '/analytics': 'Analytics',
  '/activity': 'Activity Log',
  '/notifications': 'Notifications',
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const initial = user?.email?.[0]?.toUpperCase() ?? 'U';
  const baseRoute = '/' + (pathname.split('/')[1] ?? '');
  const pageTitle = pageTitles[baseRoute] ?? '';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0 shadow-[0_1px_0_0_rgb(0_0_0/0.04)]">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-150 active:scale-95"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {pageTitle && (
          <>
            <span className="text-gray-200 select-none" aria-hidden="true">|</span>
            <span className="text-sm font-semibold text-gray-700">{pageTitle}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <Link
          href="/notifications"
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-150 relative"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </Link>

        <div className="w-px h-5 bg-gray-200" aria-hidden="true" />

        <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[180px]">
          {user?.email ?? ''}
        </span>
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
          aria-hidden="true"
          title={user?.email ?? 'User'}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
