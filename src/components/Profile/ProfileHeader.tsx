import React, { useState } from 'react';
import { Check, User } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { translations } from '../../translations/fr';
import { ImageModal } from '../ui/ImageModal';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const { profile: t } = translations;

  return (
    <>
      <div className="relative h-14 md:h-6 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="absolute -bottom-16 left-6 flex items-center gap-4 md:gap-8">
            <div className="relative">
            <div 
              className="w-32 h-32 bg-white rounded-full border-4 border-white overflow-hidden cursor-pointer"
              onClick={() => profile.avatar && setShowImageModal(true)}
            >
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <User 
                  className="w-full h-full text-gray-500"
                />
              )}
            </div>
            {profile.verified && (
              <div className="absolute -right-2 -top-2 bg-blue-500 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex flex-col items-center bg-white rounded-lg px-2 md:px-4 py-2 shadow-md min-w-[80px] md:min-w-0">
              <div className="flex items-center gap-1.5 text-gray-900">
                <span className="font-bold text-lg">{profile.stats.eventsCreated}</span>
              </div>
              <span className="text-[10px] w-16	 md:w-auto md:text-xs text-gray-600 text-center leading-tight">
                événement(s) créés
              </span>
            </div>

            <div className="flex flex-col items-center bg-white rounded-lg px-2 md:px-4 py-2 shadow-md min-w-[80px] md:min-w-0">
              <div className="flex items-center gap-1.5 text-gray-900">
                <span className="font-bold text-lg">{profile.stats.eventsAttended}</span>
              </div>
              <span className="text-[10px] w-16	 md:w-auto md:text-xs text-gray-600 text-center leading-tight">
                événement(s) participés
              </span>
            </div>
          </div>
        </div>
      </div>

      {showImageModal && profile.avatar && (
        <ImageModal
          imageUrl={profile.avatar}
          alt={profile.name}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  );
}