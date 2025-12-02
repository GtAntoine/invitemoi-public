import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleButton } from './GoogleButton';

interface SignUpFormProps {
  onToggleForm: () => void;
}

export function SignUpForm({ onToggleForm }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const { needsEmailConfirmation, error: signUpError } = await signUp(formData.email, formData.password);
      
      if (signUpError) {
        setError(signUpError);
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (success) {
    return (
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-xl">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg w-16 mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                        bg-clip-text text-transparent mb-4">
            Vérifiez votre boîte mail !
          </h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
            </p>
            <p className="text-gray-600">
              Cliquez sur le lien dans l'email pour activer votre compte et commencer l'aventure.
            </p>
            <p className="text-sm text-gray-500">
              Si vous ne trouvez pas l'email, pensez à vérifier vos spams.
            </p>
          </div>

          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r 
                     from-primary-500 to-secondary-500 text-white rounded-full font-medium 
                     shadow-lg hover:from-primary-600 hover:to-secondary-600 
                     transform hover:scale-105 transition-all duration-300"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                     bg-clip-text text-transparent">
          Inscription
        </h2>
        <p className="text-gray-600 mt-2">
          Créez votre compte pour commencer l'aventure.
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
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>

{/*
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>

        <GoogleButton mode="signup" />
*/}
        <div className="text-center">
          <button
            type="button"
            onClick={onToggleForm}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Déjà un compte ? Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}