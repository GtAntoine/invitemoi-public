// src/components/Profile/ProfileSocialLinks.tsx
import React from 'react';
import { Twitter, Link, Instagram } from 'lucide-react';
import { SocialLink } from '../../types/user';
import { translations } from '../../translations/fr';
import { getSocialUrl, extractSocialHandle } from '../../utils/socialLinks';

interface ProfileSocialLinksProps {
  socialLinks: SocialLink[];
}

export function ProfileSocialLinks({ socialLinks }: ProfileSocialLinksProps) {
  const { profile: t } = translations;
  const publicLinks = socialLinks.filter(link => link.isPublic);

  if (publicLinks.length === 0) {
    return null;
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      default:
        return <Link className="w-5 h-5" />;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'X (Twitter)';
      case 'instagram':
        return 'Instagram';
      default:
        return 'Contact';
    }
  };

  const renderSocialLink = (link: SocialLink, index: number) => {
    const isContact = link.platform === 'other';
    const content = (
      <>
        <div className="text-gray-500 group-hover:text-gray-700">
          {getPlatformIcon(link.platform)}
        </div>
        <span>{isContact ? link.url : extractSocialHandle(link.platform, link.url)}</span>
      </>
    );

    if (isContact) {
      return (
        <div
          key={index}
          className="flex items-center gap-2 text-gray-700 bg-gray-50 hover:bg-gray-100 
                   transition-colors rounded-full px-4 py-2 group"
        >
          {content}
        </div>
      );
    }

    return (
      <a
        key={index}
        href={getSocialUrl(link.platform, link.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors 
                 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-2 group"
      >
        {content}
      </a>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{t.socialLinks.title}</h2>
      <div className="flex flex-wrap gap-2">
        {publicLinks.map((link, index) => renderSocialLink(link, index))}
      </div>
    </div>
  );
}
