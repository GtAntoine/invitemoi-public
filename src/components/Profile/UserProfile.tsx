import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo } from './ProfileInfo';
import { ProfileInterests } from './ProfileInterests';
import { ProfileLanguages } from './ProfileLanguages';
import { ProfileSocialLinks } from './ProfileSocialLinks';
import { EditProfileForm } from './EditProfileForm';
import { translations } from '../../translations/fr';
import { ArrowLeft, Edit, Share2 } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { LoadingScreen } from '../ui/LoadingScreen';
import { ErrorMessage } from '../ui/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { shareEvent } from '../../utils/shareUtils';

interface UserProfileViewProps {
  userId: string;
  onBack: () => void;
}

export function UserProfile({ userId, onBack }: UserProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { profile, loading, error, exists, refetch } = useUserProfile(userId);
  const { user } = useAuth();
  const { profile: t } = translations;

  const handleShare = async () => {
    if (!profile) return;
    
    try {
      const success = await shareEvent(
        `Profil de ${profile.name}`,
        window.location.href
      );
      setShareSuccess(success);
      
      // Reset success message after 2 seconds
      if (success) {
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return <LoadingScreen message="Chargement du profil..." />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <ErrorMessage 
          message="Une erreur est survenue lors du chargement du profil" 
          onRetry={onBack}
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Profil non trouvé</p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md 
                   hover:bg-gray-200 transition-colors text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  if (isEditing && isOwnProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <EditProfileForm
          profile={profile}
          onComplete={async () => {
            await refetch();
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto md:w-48 md:w-[calc(100%-6rem)]">
      <button
        onClick={onBack}
        className="absolute -left-14 top-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 
                 transition-colors group md:flex hidden"
        title="Retour"
      >
        <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
      </button>

      <div className="">
        {/* Header avec navigation et bouton de partage */}
        <div className="rounded-t-lg relative pt-3 md:pt-6 flex items-center px-3 md:px-6 bg-gradient-to-r from-primary-500 to-secondary-500">
          <div className="flex items-center justify-between md:justify-end w-full">
            <div className="md:hidden">
              <button
                onClick={onBack}
                className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="relative z-10">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full 
                         hover:bg-gray-50 transition-all duration-300 shadow-md"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Partager</span>
              </button>
              {shareSuccess && (
                <div className="absolute top-full mt-2 right-0 bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md text-white px-3 py-1 
                              rounded-md text-sm whitespace-nowrap animate-fade-out z-50">
                  Lien copié !
                </div>
              )}
            </div>
          </div>
        </div>

        <ProfileHeader profile={profile} />

        <div className="rounded-b-lg bg-white shadow-md pt-20 px-6 pb-8">
          {isOwnProfile && (
            <div className="flex justify-end -mt-6 -mr-3 md:mr-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r 
                           from-primary-500 to-secondary-500 text-white rounded-full 
                           hover:from-primary-600 hover:to-secondary-600 transition-colors 
                           shadow-md"
                >
                  <Edit className="w-4 h-4" />
                  Modifier mon profil
                </button>
            </div>
          )}

          <ProfileInfo profile={profile} />

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{t.about}</h2>
            <p className="text-gray-600 whitespace-pre-line leading-4	">{profile.bio}</p>
          </div>

          <ProfileInterests interests={profile.interests} />
          <ProfileSocialLinks socialLinks={profile.socialLinks} />
          <ProfileLanguages languages={profile.languages} />
        </div>
      </div>
    </div>
  );
}