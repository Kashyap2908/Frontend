interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return <div className={['animate-shimmer rounded-md h-4', className].join(' ')} />;
  }

  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={[
            'animate-shimmer rounded-md h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full',
            className,
          ].join(' ')}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm ring-1 ring-gray-900/[0.04] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton lines={2} />
    </div>
  );
}
