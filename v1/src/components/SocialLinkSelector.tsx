import React from 'react';
import { Twitter, Instagram, Link as LinkIcon } from 'lucide-react';
import { SocialLink } from '../types/user';
import { extractSocialHandle } from '../utils/socialLinks';
import clsx from 'clsx';

interface SocialLinkSelectorProps {
  socialLinks: SocialLink[];
  selectedLinks: string[];
  onToggleLink: (platform: string) => void;
}


export function SocialLinkSelector({ 
  socialLinks, 
  selectedLinks, 
  onToggleLink 
}: SocialLinkSelectorProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5"/>;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'X (Twitter)';
      case 'instagram':
        return 'Instagram';
      default:
        return 'Autre';
    }
  };
  
  const handleClick = (e: React.MouseEvent, platform: string) => {
    e.preventDefault(); // Prevent form submission
    onToggleLink(platform);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Sélectionnez les réseaux sociaux que vous souhaitez partager :
      </p>
      <div className="space-y-2">
        {socialLinks.map(link => (
          <button
            key={link.platform}
            onClick={(e) => handleClick(e, link.platform)}
            type="button"
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300',
              selectedLinks.includes(link.platform)
                ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            )}
          >
            <div className={clsx(
              'p-2 rounded-full',
              selectedLinks.includes(link.platform)
                ? 'bg-primary-100 text-primary-600'
                : 'bg-gray-200 text-gray-600'
            )}>
              {getPlatformIcon(link.platform)}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {getPlatformLabel(link.platform)}
              </div>
              <div className="text-sm text-gray-500">
              {link.platform === 'other' ? link.url : extractSocialHandle(link.platform, link.url)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}