import React, { useState } from 'react';
import { translations } from '../translations/fr';
import { Gift, HandHeart, X } from 'lucide-react';
import { SocialLinkSelector } from './SocialLinkSelector';
import { SocialLink } from '../types/user';
import { LocationInput } from './ui/LocationInput';
import clsx from 'clsx';

interface ApplicationModalProps {
  onSubmit: (message: string, sharedSocialLinks: string[], tempContact?: string) => void;
  onClose: () => void;
  isOffering: boolean;
  socialLinks: SocialLink[];
}

export function ApplicationModal({ 
  onSubmit, 
  onClose, 
  isOffering,
  socialLinks 
}: ApplicationModalProps) {
  const [message, setMessage] = useState('');
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [tempContact, setTempContact] = useState('');
  const { applicationModal } = translations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message, selectedLinks, tempContact);
    }
  };

  const toggleLink = (platform: string) => {
    setSelectedLinks(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const hasInstagram = socialLinks.some(link => 
    link.platform === 'instagram' && link.isPublic && link.url.trim() !== ''
  );

  const Icon = isOffering ? HandHeart : Gift;
  const gradientColors = isOffering 
    ? 'from-secondary-500 to-secondary-600'
    : 'from-primary-500 to-primary-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <div className={clsx(
              "p-2 rounded-full text-white",
              "bg-gradient-to-r",
              gradientColors
            )}>
              <Icon className="w-5 h-5" />
            </div>
            {isOffering ? applicationModal.titleGuest : applicationModal.titleHost}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {applicationModal.messageLabel}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength="500"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                       dark:bg-gray-700 dark:text-white min-h-[120px] transition-all duration-300"
              required
              placeholder={applicationModal.placeholder}
            />
          </div>

          {!hasInstagram && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact
              </label>
              <LocationInput
                value={tempContact}
                onChange={setTempContact}
                required={!hasInstagram}
              />
            </div>
          )}

          {socialLinks.length > 0 && (
            <SocialLinkSelector
              socialLinks={socialLinks}
              selectedLinks={selectedLinks}
              onToggleLink={toggleLink}
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                       rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 
                       transform hover:scale-105 transition-all duration-300"
            >
              {applicationModal.cancel}
            </button>
            <button
              type="submit"
              className={clsx(
                "px-4 py-2 text-white rounded-full font-medium shadow-lg",
                "transform hover:scale-105 transition-all duration-300",
                isOffering
                  ? "bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700"
                  : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              )}
            >
              {applicationModal.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}