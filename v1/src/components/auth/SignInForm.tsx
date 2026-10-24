import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleButton } from './GoogleButton';

interface SignInFormProps {
  onToggleForm: () => void;
}

export function SignInForm({ onToggleForm }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                     bg-clip-text text-transparent">
          Connexion
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Bienvenue ! Connectez-vous pour continuer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
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
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        {/*
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <GoogleButton mode="signin" />
*/}
        <div className="text-center space-y-3">
          <button
            type="button"
            onClick={() => navigate('/auth/reset-password')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Mot de passe oublié ?
          </button>

          <div>
            <button
              type="button"
              onClick={onToggleForm}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Pas encore de compte ? S'inscrire
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}