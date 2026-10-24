// src/layouts/BaseLayout.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseLayout({ children, className = '' }: BaseLayoutProps) {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-900 dark:to-gray-800 relative">
        {/* Decorative elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/30 dark:bg-primary-500/10 rounded-full 
                        filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary-500/30 dark:bg-secondary-500/10 rounded-full 
                        filter blur-3xl animate-pulse-slow"></div>
        </div>
        
        {/* Content */}
        <div className={`relative z-10 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
