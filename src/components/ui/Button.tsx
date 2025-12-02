// src/components/ui/Button.tsx
import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glass' | 'neu';
  color?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  className = '', 
  variant = 'glass',
  color = 'primary',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        variant === 'glass' ? 'glass-button' : 'neu-button',
        color === 'primary' 
          ? 'from-primary-500 to-primary-600' 
          : 'from-secondary-500 to-secondary-600',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
