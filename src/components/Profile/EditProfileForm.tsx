import React, { useState } from 'react';
import { useUserProfileForm } from '../../hooks/useUserProfileForm';
import { useImageUpload } from '../../hooks/useImageUpload';
import { formatSocialLink, extractSocialHandle, getSocialInputPlaceholder } from '../../utils/socialLinks';
import { LocationInput } from '../ui/LocationInput';
import { UserProfile, UserInterest } from '../../types/user';
import { Twitter, Instagram, Link as LinkIcon } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { InterestsSelector } from './InterestsSelector';
import { LanguagesSelector } from './LanguagesSelector';

interface EditProfileFormProps {
  profile: UserProfile;
  onComplete: () => void;
  onCancel: () => void;
}

const DEFAULT_SOCIAL_LINKS = [
  { platform: 'instagram' as const, url: '', isPublic: true },
  { platform: 'twitter' as const, url: '', isPublic: true },
  { platform: 'other' as const, url: '', isPublic: true }
];

export function EditProfileForm({ profile, onComplete, onCancel }: EditProfileFormProps) {
  // Fusionner les liens sociaux existants avec les liens par défaut
  const initialSocialLinks = DEFAULT_SOCIAL_LINKS.map(defaultLink => {
    const existingLink = profile.socialLinks.find(link => link.platform === defaultLink.platform);
    return existingLink || defaultLink;
  });

  const [formData, setFormData] = useState({
    name: profile.name,
    avatar: profile.avatar,
    bio: profile.bio,
    location: profile.location,
    birthDate: profile.birthDate,
    interests: profile.interests,
    languages: profile.languages,
    socialLinks: initialSocialLinks
  });

  const { updateProfile, loading, error } = useUserProfileForm();
  const { uploadImage, deleteImage, uploading } = useImageUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transformer les pseudos en URLs complètes
    const socialLinks = formData.socialLinks
      .filter(link => link.url.trim() !== '')
      .map(link => ({
        ...link,
        url: formatSocialLink(link.platform, link.url)
      }));
    
    const success = await updateProfile({
      ...formData,
      socialLinks
    });

    if (success) {
      onComplete();
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (file: File) => {
    const url = await uploadImage(file, 'avatars');
    if (url) {
      if (formData.avatar) {
        await deleteImage(formData.avatar);
      }
      setFormData(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleImageRemove = async () => {
    if (formData.avatar) {
      await deleteImage(formData.avatar);
      setFormData(prev => ({ ...prev, avatar: '' }));
    }
  };

  const handleInterestsChange = (interests: UserInterest[]) => {
    setFormData(prev => ({ ...prev, interests }));
  };

  const handleLanguagesChange = (languages: string[]) => {
    setFormData(prev => ({ ...prev, languages }));
  };

  const handleSocialLinkChange = (index: number, field: 'url' | 'isPublic', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-3 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifier mon profil</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <ImageUpload
          currentImage={formData.avatar}
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          className="w-32 h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prénom (ou pseudo pour les timides)
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={6}
          maxLength="10000"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Localisation
        </label>
       <LocationInput
          value={formData.location}
          onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de naissance
        </label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Centres d'intérêt</h3>
        <InterestsSelector
          selectedInterests={formData.interests}
          onInterestsChange={handleInterestsChange}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Langues parlées</h3>
        <LanguagesSelector
          selectedLanguages={formData.languages}
          onLanguagesChange={handleLanguagesChange}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Réseaux sociaux</h3>
        <div className="space-y-4">
          {formData.socialLinks.map((link, index) => (
            <div key={link.platform} className="flex items-center gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  {getPlatformIcon(link.platform)}
                  {getPlatformLabel(link.platform)}
                </label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder={getSocialInputPlaceholder(link.platform)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                           focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Public</label>
                <input
                  type="checkbox"
                  checked={link.isPublic}
                  onChange={(e) => handleSocialLinkChange(index, 'isPublic', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end flex-col md:flex-row md-flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 md:max-w-fit bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6  rounded-full font-medium shadow-lg hover:from-primary-600 hover:to-secondary-600  transform hover:scale-105 transition-all duration-300 disabled:opacity-50 
                   disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading || uploading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1  md:max-w-fit bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-medium 
                   hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}