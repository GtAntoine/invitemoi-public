// src/components/Logo.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center gap-2 cursor-pointer group"
    >
      <div className="relative min-w-max">
        <img 
          src="/images/logo.svg" 
          alt="Invite Moi Logo" 
          className="w-14 h-14 rounded-lg transform group-hover:scale-105 transition-all duration-300"
        />
      </div>
      <div className="hidden md:flex flex-col w-32 lg:w-auto">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 
                     to-secondary-600 bg-clip-text text-transparent group-hover:from-primary-500 
                     group-hover:to-secondary-500 transition-colors dark:text-white dark:bg-clip-text">
          Invite Moi
        </h1>
        <span className="w-32 lg:w-auto text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 
                      dark:group-hover:text-gray-300 transition-colors">
        </span>
      </div>
    </div>
  );
}
