import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import { BaseLayout } from '../layouts/BaseLayout';
import { GlassCard } from '../components/ui/GlassCard';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi du mail');
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
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
            <GlassCard className="w-full max-w-md text-center">
              <div className="p-3 bg-gradient-to-r from-primary-500/80 to-secondary-500/80 
                           rounded-xl shadow-glass w-16 mx-auto mb-6">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                          bg-clip-text text-transparent mb-4">
                Vérifiez votre boîte mail !
              </h2>
              <p className="text-gray-700">
                Un email de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
                Le lien de réinitialisation est valide pendant 24 heures.
              </p>
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-6 glass-button"
              >
                Retour à la connexion
              </button>
            </GlassCard>
          </div>
        </div>
      </BaseLayout>
    );
  }

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
        <div className="flex-1 flex items-center justify-center p-4 mt-8 md:mt-0">
          <GlassCard className="w-full max-w-md">
            <button
              onClick={() => navigate('/auth/login')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </button>

            <div className="text-center mb-8">
              <div className="p-3 bg-gradient-to-r from-primary-500/80 to-secondary-500/80 
                           rounded-xl shadow-glass w-16 mx-auto mb-6">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                          bg-clip-text text-transparent mb-2">
                Réinitialisation du mot de passe
              </h2>
              <p className="text-gray-700">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 text-red-600 p-3 rounded-lg text-sm backdrop-blur-sm">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full glass-button"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </BaseLayout>
  );
}