'use client';

import { Toaster, toast } from 'react-hot-toast';

export function useToast() {
  return {
    showToast: (message: string, type: 'success' | 'error' = 'success') => {
      if (type === 'error') toast.error(message);
      else toast.success(message);
    },
  };
}

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#ffffff',
          color: '#0f172a',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
          fontSize: '0.875rem',
          fontWeight: '500',
          maxWidth: '360px',
          padding: '12px 16px',
          border: '1px solid rgb(241 245 249)',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#fff' },
          style: {
            borderLeft: '3px solid #22c55e',
          },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
          style: {
            borderLeft: '3px solid #ef4444',
          },
        },
      }}
    />
  );
}
