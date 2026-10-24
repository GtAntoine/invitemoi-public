import React from 'react';
import clsx from 'clsx';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <div className={clsx(
      'absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1',
      'flex items-center justify-center',
      'bg-red-500 text-white text-xs font-bold rounded-full',
      className
    )}>
      {count > 99 ? '99+' : count}
    </div>
  );
}