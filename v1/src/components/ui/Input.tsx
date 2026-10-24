// src/components/ui/Input.tsx
import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'glass' | 'neu';
}

export function Input({ 
  className = '', 
  variant = 'glass',
  ...props 
}: InputProps) {
  return (
    <input
      className={clsx(
        'glass-input w-full',
        className
      )}
      {...props}
    />
  );
}
