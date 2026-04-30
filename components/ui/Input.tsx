'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="pointer-events-none absolute left-3 text-gray-400">{leftAddon}</div>
          )}
          <input
            suppressHydrationWarning
            autoComplete="off"          // standard HTML
            data-lpignore="true"        // LastPass ignore
            data-1p-ignore              // 1Password ignore
            data-bwignore               // Bitwarden ignore
            
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-lg border px-3 py-2 text-sm bg-white',
              'transition-colors placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
              leftAddon ? 'pl-10' : '',
              rightAddon ? 'pr-10' : '',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
              className,
            ].join(' ')}
            {...props}
          />
          {rightAddon && (
            <div className="pointer-events-none absolute right-3 text-gray-400">{rightAddon}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
