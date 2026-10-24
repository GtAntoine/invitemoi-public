// src/components/ui/ConfirmDialog.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  isDangerous = false
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-sm w-full p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/20">
          <div className={clsx(
            "p-3 rounded-xl shadow-glass",
            isDangerous 
              ? "bg-gradient-to-r from-red-500/80 to-red-600/80" 
              : "bg-gradient-to-r from-primary-500/80 to-secondary-500/80"
          )}>
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 
                        bg-clip-text text-transparent">
            {title}
          </h2>
        </div>

        <p className="my-6 text-gray-700">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="glass-button from-gray-500/80 to-gray-600/80"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={clsx(
              "glass-button",
              isDangerous
                ? "from-red-500/80 to-red-600/80"
                : "from-primary-500/80 to-secondary-500/80"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
