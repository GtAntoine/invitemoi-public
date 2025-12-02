import React, { createContext, useContext } from 'react';
import { useUserPreferences } from '../hooks/useUserPreferences';

interface NotificationContextType {
  pushEnabled: boolean;
  emailEnabled: boolean;
  togglePushNotifications: () => Promise<void>;
  toggleEmailNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreference } = useUserPreferences();

  const togglePushNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Ce navigateur ne supporte pas les notifications push');
      return;
    }

    try {
      if (Notification.permission === 'denied') {
        alert('Les notifications ont été bloquées. Veuillez les autoriser dans les paramètres de votre navigateur.');
        return;
      }

      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          return;
        }
      }

      await updatePreference('push_enabled', !preferences.push_enabled);
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      alert('Une erreur est survenue lors de la modification des notifications');
    }
  };

  const toggleEmailNotifications = async () => {
    try {
      await updatePreference('email_enabled', !preferences.email_enabled);
    } catch (error) {
      console.error('Error toggling email notifications:', error);
      alert('Une erreur est survenue lors de la modification des notifications');
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        pushEnabled: preferences.push_enabled, 
        emailEnabled: preferences.email_enabled, 
        togglePushNotifications, 
        toggleEmailNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}