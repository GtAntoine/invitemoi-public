import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EmailChangeFormProps {
  currentEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmailChangeForm({ currentEmail, onClose, onSuccess }: EmailChangeFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password
      });

      if (signInError) {
        throw new Error('Mot de passe incorrect');
      }

      // Update email
      const { error: updateError } = await supabase.auth.updateUser({ 
        email: email 
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 5000); // Ferme automatiquement après 5 secondes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Vérifiez votre boîte mail</h2>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-gray-600">
              Un email de confirmation a été envoyé à <strong>{email}</strong>.
            </p>
            <p className="text-gray-600">
              Veuillez cliquer sur le lien dans l'email pour confirmer votre nouvelle adresse.
            </p>
            <p className="text-sm text-gray-500">
              Cette fenêtre se fermera automatiquement dans quelques secondes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Modifier l'email</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouvel email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                       transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-gradient-to-r from-primary-500 to-primary-600 
                       rounded-lg hover:from-primary-600 hover:to-primary-700 transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}