import { createRoot } from 'react-dom/client';
import React from 'react';
import { MapDialog } from '../components/ui/MapDialog';

export function getMapUrl(address: string) {
  const encodedAddress = encodeURIComponent(address);
  
  // URL spécifique pour Google Maps sur iOS
  const googleMapsIosUrl = `comgooglemaps://?q=${encodedAddress}`;
  // URL de fallback pour Google Maps web
  const googleMapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  // URL pour Apple Plans
  const appleMapsUrl = `maps://maps.apple.com/?q=${encodedAddress}`;
  
  return {
    google: {
      app: googleMapsIosUrl,
      web: googleMapsWebUrl
    },
    apple: appleMapsUrl
  };
}

export function openInMaps(address: string) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const urls = getMapUrl(address);
  
  if (isIOS) {
    // Créer dynamiquement le dialogue pour iOS
    renderMapDialog(address, urls);
  } else {
    // Sur les autres plateformes, ouvrir directement dans Google Maps
    window.open(urls.google.web, '_blank');
  }
}

// Fonction séparée pour le rendu du dialogue
function renderMapDialog(address: string, urls: ReturnType<typeof getMapUrl>) {
  // Créer un élément de dialogue personnalisé
  const dialog = document.createElement('div');
  dialog.id = 'map-dialog';
  document.body.appendChild(dialog);
  
  const root = createRoot(dialog);
  
  const closeDialog = () => {
    root.unmount();
    document.body.removeChild(dialog);
  };

  // Utiliser React.createElement dans un fichier .ts
  root.render(
    React.createElement(MapDialog, {
      isOpen: true,
      address: address,
      onClose: closeDialog,
      onSelectMap: (type: string) => {
        if (type === 'google') {
          window.location.href = urls.google.app;
        } else {
          window.location.href = urls.apple;
        }
        closeDialog();
      }
    })
  );
}