import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Shield, Bell, Moon, Trash2, LogOut } from 'lucide-react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmailChangeForm } from '../components/settings/EmailChangeForm';
import { PasswordChangeForm } from '../components/settings/PasswordChangeForm';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useScrollTop } from '../hooks/useScrollTop';

export function SettingsPage() {
   // Utiliser le hook useScrollTop pour scroller en haut de la page au montage
  useScrollTop();
  
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { pushEnabled, emailEnabled, togglePushNotifications, toggleEmailNotifications } = useNotifications();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id);

      if (error) throw error;
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleSettingsSuccess = () => {
    // Show success message or refresh user data if needed
  };

  return (
    <div className="min-h-screen">
      <Header
        onSeekHost={() => navigate('/events/create/seeking-host')}
        onOfferHost={() => navigate('/events/create/offering-host')}
        onToggleDashboard={() => navigate('/dashboard')}
        onToggleProfile={() => navigate(`/profile/${user?.id}`)}
        onHome={() => navigate('/events')}
        showDashboard={false}
        showProfile={false}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-primary-500 to-secondary-500">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Paramètres
            </h1>
          </div>

          {/* Settings Sections */}
          <div className="p-6 space-y-8">
            {/* Account Settings */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                Compte et sécurité
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => setShowEmailForm(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Modifier
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Mot de passe</h3>
                    <p className="text-sm text-gray-500">••••••••</p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordForm(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </section>

            {/* Notifications Settings */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-500" />
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications par email</h3>
                    <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={toggleEmailNotifications}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-primary-300 rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full 
                                after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600">
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications push</h3>
                    <p className="text-sm text-gray-500">Recevoir les notifications sur le navigateur</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushEnabled}
                      onChange={togglePushNotifications}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-primary-300 rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full 
                                after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600">
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Appearance Settings */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary-500" />
                Apparence
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Mode sombre</h3>
                    <p className="text-sm text-gray-500">Activer le thème sombre</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={toggleDarkMode}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-primary-300 rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full 
                                after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600">
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Zone de danger */}
            <section className="border-t pt-8">
              <div className="bg-red-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-red-700 mb-4">Zone de danger</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 
                             transition-colors text-gray-900"
                  >
                    <LogOut className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <h3 className="font-medium">Se déconnecter</h3>
                      <p className="text-sm text-gray-500">Déconnexion de votre compte</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 
                             transition-colors text-gray-900"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div className="text-left">
                      <h3 className="font-medium">Supprimer le compte</h3>
                      <p className="text-sm text-gray-500">Supprimer définitivement votre compte</p>
                    </div>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Forms and Dialogs */}
      {showEmailForm && user?.email && (
        <EmailChangeForm
          currentEmail={user.email}
          onClose={() => setShowEmailForm(false)}
          onSuccess={handleSettingsSuccess}
        />
      )}

      {showPasswordForm && (
        <PasswordChangeForm
          onClose={() => setShowPasswordForm(false)}
          onSuccess={handleSettingsSuccess}
        />
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmLabel="Se déconnecter"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Supprimer le compte"
        message="Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
        isDangerous
      />
    </div>
  );
}