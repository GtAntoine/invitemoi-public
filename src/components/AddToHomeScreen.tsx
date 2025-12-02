// src/components/AddToHomeScreen.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    AddToHomeScreen: (config: any) => { show: (lang: string) => void };
    AddToHomeScreenInstance: { show: (lang: string) => void };
  }
}

export function AddToHomeScreen() {
  const location = useLocation();

  useEffect(() => {
    // Ne montrer que sur mobile
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Initialiser Add to Homescreen
      if (window.AddToHomeScreen) {
        window.AddToHomeScreenInstance = window.AddToHomeScreen({
          appName: 'Invite Moi',
          appNameDisplay: 'standalone',
          appIconUrl: '/apple-touch-icon.png',
          assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.93/dist/assets/img/',
          maxModalDisplayCount: 1,
          displayOptions: { showMobile: true, showDesktop: false },
          allowClose: true,
        });

        // Afficher la bannière
        window.AddToHomeScreenInstance.show('fr');
      }
    }
  }, [location]);

  return null;
}
