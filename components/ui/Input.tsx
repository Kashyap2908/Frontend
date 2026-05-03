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
  ({ label, error, hint, leftAddon, rightAddon, className = '', id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 leading-none">
            {label}
            {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="pointer-events-none absolute left-3 text-gray-400">{leftAddon}</div>
          )}
          <input
            suppressHydrationWarning
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore
            data-bwignore
            ref={ref}
            id={inputId}
            required={required}
            className={[
              'w-full rounded-lg border px-3 py-2.5 text-sm bg-white text-gray-900',
              'transition-all duration-150 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
              leftAddon ? 'pl-10' : '',
              rightAddon ? 'pr-10' : '',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20 bg-red-50/30'
                : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
              className,
            ].join(' ')}
            {...props}
          />
          {rightAddon && (
            <div className="pointer-events-none absolute right-3 text-gray-400">{rightAddon}</div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
