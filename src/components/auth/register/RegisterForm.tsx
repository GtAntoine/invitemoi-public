// src/components/auth/register/RegisterForm.tsx
import React from 'react';
import { UserPlus } from 'lucide-react';
import { RegisterFormFields } from './RegisterFormFields';
import { RegisterSocialButtons } from './RegisterSocialButtons';
import { useRegisterForm } from '../../../hooks/auth/useRegisterForm';

export function RegisterForm({ onToggleForm }: { onToggleForm: () => void }) {
  const { handleSubmit, success, loading, error } = useRegisterForm();

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                     bg-clip-text text-transparent dark:text-white">
          Inscription
        </h2>
        <p className="text-gray-600 mt-2 dark:text-gray-400">
          Créez votre compte pour commencer l'aventure.
        </p>
      </div>

      <RegisterFormFields 
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />

      {/* <RegisterSocialButtons /> */}

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onToggleForm}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium dark:text-primary-400"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
}
