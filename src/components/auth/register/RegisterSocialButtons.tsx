// src/components/auth/register/RegisterSocialButtons.tsx
import React from 'react';
import { GoogleButton } from '../GoogleButton';

export function RegisterSocialButtons() {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            Ou
          </span>
        </div>
      </div>

      <div className="mt-6">
        <GoogleButton mode="signup" />
      </div>
    </div>
  );
}
