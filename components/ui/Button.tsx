'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500/30 border-transparent shadow-sm',
  secondary:
    'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400/30 border-gray-300 shadow-sm',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400/30 border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/30 border-transparent shadow-sm',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium border',
        'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1',
        'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
);

Button.displayName = 'Button';
