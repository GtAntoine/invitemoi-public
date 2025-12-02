import React from 'react';
import { AuthModal } from '../components/auth/AuthModal';
import { Logo } from '../components/Logo';
import { BaseLayout } from '../layouts/BaseLayout';

export function LoginPage() {
  window.scrollTo({ top: 0 });
  
  return (
    <BaseLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-glass border-b border-white/20 shadow-glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Logo />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4 mt-4 pb-10 md:mt-0">
          <div className="w-full max-w-md">
            <AuthModal isOpen={true} onClose={() => {}} isSignIn={true} />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}