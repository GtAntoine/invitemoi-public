// src/components/auth/AuthModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignIn?: boolean;
}

export function AuthModal({ isOpen, onClose, isSignIn = true }: AuthModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleToggleForm = () => {
    navigate(isSignIn ? '/auth/register' : '/auth/login');
  };

  return (
    <div className="glass-card p-6 backdrop-blur-xl">
      {isSignIn ? (
        <SignInForm onToggleForm={handleToggleForm} />
      ) : (
        <SignUpForm onToggleForm={handleToggleForm} />
      )}
    </div>
  );
}
