import React from 'react';
import { MapPin } from 'lucide-react';

interface MapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMap: (type: 'google' | 'apple') => void;
  address: string;
}

export function MapDialog({ isOpen, onClose, onSelectMap, address }: MapDialogProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="glass-card max-w-sm w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-white/20">
          <div className="p-3 bg-gradient-to-r from-primary-500/80 to-secondary-500/80 rounded-xl shadow-glass">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 
                          bg-clip-text text-transparent">
              Ouvrir dans...
            </h2>
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{address}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => onSelectMap('apple')}
            className="w-full glass-button from-primary-500/80 to-primary-600/80"
          >
            Apple Plans
          </button>
          <button
            onClick={() => onSelectMap('google')}
            className="w-full glass-button from-secondary-500/80 to-secondary-600/80"
          >
            Google Maps
          </button>
          <button
            onClick={onClose}
            className="w-full glass-button from-gray-500/80 to-gray-600/80"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}