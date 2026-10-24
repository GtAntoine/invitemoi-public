import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface MorphButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function MorphButton({ to, children, className = '', variant = 'primary' }: MorphButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!buttonRef.current) return;

    // Get button position and dimensions
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    // Create a clone of the button that will animate
    const clone = button.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.margin = '0';
    clone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    
    document.body.appendChild(clone);

    // Calculate target position (top right corner)
    const targetX = window.innerWidth - 80; // 80px from right
    const targetY = 20; // 20px from top
    
    // Start animation
    requestAnimationFrame(() => {
      clone.style.transform = 'scale(0.5)';
      clone.style.borderRadius = '9999px';
      clone.style.left = `${targetX}px`;
      clone.style.top = `${targetY}px`;
      clone.style.opacity = '0';
    });

    // Navigate after animation
    setTimeout(() => {
      document.body.removeChild(clone);
      navigate(to);
    }, 500);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={clsx(
        'glass-button inline-flex items-center gap-2',
        variant === 'primary' 
          ? 'from-primary-500/80 to-primary-600/80' 
          : 'from-secondary-500/80 to-secondary-600/80',
        className
      )}
    >
      {children}
    </button>
  );
}
