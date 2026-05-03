import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-white rounded-xl border border-gray-100 shadow-sm ring-1 ring-gray-900/[0.04]',
        paddingClasses[padding],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['flex items-center justify-between mb-5', className].join(' ')} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={['text-base font-semibold text-gray-900 tracking-tight', className].join(' ')}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={['text-sm text-gray-500 leading-relaxed', className].join(' ')} {...props}>
      {children}
    </p>
  );
}
