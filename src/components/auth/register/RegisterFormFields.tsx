import React, { useState } from 'react';

interface RegisterFormFieldsProps {
  onSubmit: (data: { email: string; password: string; confirmPassword: string }) => void;
  loading: boolean;
  error: string | null;
}

export function RegisterFormFields({ onSubmit, loading, error }: RegisterFormFieldsProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm dark:bg-red-900/50">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 
                   dark:border-gray-700 dark:text-white transition-all duration-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 
                   dark:border-gray-700 dark:text-white transition-all duration-300"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 
                   dark:border-gray-700 dark:text-white transition-all duration-300"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white 
                 py-2.5 rounded-lg font-medium shadow-lg hover:from-primary-600 
                 hover:to-secondary-600 transform hover:scale-105 transition-all duration-300 
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}