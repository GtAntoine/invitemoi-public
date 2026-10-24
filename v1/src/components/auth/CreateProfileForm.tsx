import React, { useState } from 'react';
import { useUserProfileForm } from '../../hooks/useUserProfileForm';
import { useImageUpload } from '../../hooks/useImageUpload';
import { formatSocialLink } from '../../utils/socialLinks';
import { UserPlus, Twitter, Instagram, Link as LinkIcon } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { LocationInput } from '../ui/LocationInput';

interface CreateProfileFormProps {
  onComplete: () => void;
}

const DEFAULT_SOCIAL_LINKS = [
  { platform: 'twitter' as const, url: '', isPublic: true },
  { platform: 'instagram' as const, url: '', isPublic: true },
  { platform: 'other' as const, url: '', isPublic: true }
];

export function CreateProfileForm({ onComplete }: CreateProfileFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    location: '',
    birthDate: '',
    socialLinks: DEFAULT_SOCIAL_LINKS
  });

  const { createProfile, loading, error } = useUserProfileForm();
  const { uploadImage, uploading } = useImageUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transformer les pseudos en URLs complètes
    const socialLinks = formData.socialLinks
      .filter(link => link.url.trim() !== '')
      .map(link => ({
        ...link,
        url: formatSocialLink(link.platform, link.url)
      }));
    
    const success = await createProfile({
      ...formData,
      socialLinks
    });

    if (success) {
      onComplete();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (file: File) => {
    const url = await uploadImage(file, 'avatars');
    if (url) {
      setFormData(prev => ({ ...prev, avatar: url }));
    }
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
        return 'Autre contact';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 pb-4 border-b border-primary-100">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 
                          bg-clip-text text-transparent">
              Créez votre profil
            </h2>
            <p className="text-primary-600">Renseignez vos informations pour commencer</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <ImageUpload
            currentImage={formData.avatar}
            onImageSelect={handleImageSelect}
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
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            placeholder="Parlez-nous un peu de vous..."
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
          <h3 className="text-lg font-medium text-gray-900">Réseaux sociaux (optionnel)</h3>
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
                    placeholder={`@pseudo ou autre contact`}
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

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 
                   rounded-full font-medium shadow-lg hover:from-primary-600 hover:to-primary-700 
                   transform hover:scale-105 transition-all duration-300 disabled:opacity-50 
                   disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading || uploading ? 'Création du profil...' : 'Créer mon profil'}
        </button>
      </form>
    </div>
  );
}