// src/components/ui/Card.tsx
import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'neu';
}

export function Card({ children, className = '', variant = 'glass' }: CardProps) {
  return (
    <div className={clsx(
      variant === 'glass' ? 'glass-card' : 'neu-card',
      className
    )}>
      {children}
    </div>
  );
}
