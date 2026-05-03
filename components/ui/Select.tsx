'use client';

import { forwardRef, useId, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, required, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700 leading-none">
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={[
            'w-full rounded-lg border px-3 py-2.5 text-sm bg-white text-gray-900',
            'transition-all duration-150 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
              : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
            className,
          ].join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
