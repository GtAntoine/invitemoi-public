import React from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div className={clsx(
      'glass-card p-8',
      hover && 'hover:shadow-glass-lg hover:scale-[1.02]',
      className
    )}>
      {children}
    </div>
  );
}