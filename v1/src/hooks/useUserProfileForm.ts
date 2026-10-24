import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { UserInterest } from '../types/user';

interface UserProfileFormData {
  name: string;
  avatar?: string;
  bio?: string;
  location: string;
  birthDate: string;
  interests?: UserInterest[];
  languages?: string[];
  socialLinks?: {
    platform: 'twitter' | 'instagram' | 'other';
    url: string;
    isPublic: boolean;
  }[];
}

export function useUserProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createProfile = async (data: UserProfileFormData) => {
    if (!user) throw new Error('User must be authenticated');
    setLoading(true);
    setError(null);

    try {
      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: data.name,
          avatar: data.avatar,
          bio: data.bio || '',
          location: data.location,
          birth_date: data.birthDate,
        });

      if (userError) throw userError;

      // Create interests if provided
      if (data.interests && data.interests.length > 0) {
        const { error: interestsError } = await supabase
          .from('interests')
          .insert(
            data.interests.map(interest => ({
              user_id: user.id,
              category: interest.category,
              level: interest.level
            }))
          );

        if (interestsError) throw interestsError;
      }

      // Create languages if provided
      if (data.languages && data.languages.length > 0) {
        const { error: languagesError } = await supabase
          .from('languages')
          .insert(
            data.languages.map(language => ({
              user_id: user.id,
              language
            }))
          );

        if (languagesError) throw languagesError;
      }

      // Create social links if provided
      if (data.socialLinks && data.socialLinks.length > 0) {
        const validSocialLinks = data.socialLinks.filter(link => link.url.trim() !== '');
        
        if (validSocialLinks.length > 0) {
          const { error: socialLinksError } = await supabase
            .from('social_links')
            .insert(
              validSocialLinks.map(link => ({
                user_id: user.id,
                platform: link.platform,
                url: link.url,
                is_public: link.isPublic
              }))
            );

          if (socialLinksError) throw socialLinksError;
        }
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfileFormData>) => {
    if (!user) throw new Error('User must be authenticated');
    setLoading(true);
    setError(null);

    try {
      // Update user profile
      if (Object.keys(data).length > 0) {
        const { error: userError } = await supabase
          .from('users')
          .update({
            name: data.name,
            avatar: data.avatar,
            bio: data.bio || '',
            location: data.location,
            birth_date: data.birthDate,
          })
          .eq('id', user.id);

        if (userError) throw userError;
      }

      // Update interests
      if (data.interests) {
        // Delete existing interests
        const { error: deleteInterestsError } = await supabase
          .from('interests')
          .delete()
          .eq('user_id', user.id);

        if (deleteInterestsError) throw deleteInterestsError;

        // Insert new interests
        if (data.interests.length > 0) {
          const { error: interestsError } = await supabase
            .from('interests')
            .insert(
              data.interests.map(interest => ({
                user_id: user.id,
                category: interest.category,
                level: interest.level
              }))
            );

          if (interestsError) throw interestsError;
        }
      }

      // Update languages
      if (data.languages) {
        // Delete existing languages
        const { error: deleteLanguagesError } = await supabase
          .from('languages')
          .delete()
          .eq('user_id', user.id);

        if (deleteLanguagesError) throw deleteLanguagesError;

        // Insert new languages
        if (data.languages.length > 0) {
          const { error: languagesError } = await supabase
            .from('languages')
            .insert(
              data.languages.map(language => ({
                user_id: user.id,
                language
              }))
            );

          if (languagesError) throw languagesError;
        }
      }

      // Update social links
      if (data.socialLinks) {
        // Delete existing links
        const { error: deleteError } = await supabase
          .from('social_links')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Insert new links
        const validSocialLinks = data.socialLinks.filter(link => link.url.trim() !== '');
        
        if (validSocialLinks.length > 0) {
          const { error: socialLinksError } = await supabase
            .from('social_links')
            .insert(
              validSocialLinks.map(link => ({
                user_id: user.id,
                platform: link.platform,
                url: link.url,
                is_public: link.isPublic
              }))
            );

          if (socialLinksError) throw socialLinksError;
        }
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProfile,
    updateProfile,
    loading,
    error
  };
}