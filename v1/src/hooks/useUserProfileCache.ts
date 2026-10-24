import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/user';

// Cache pour stocker les profils utilisateurs
const profileCache = new Map<string, {
  profile: UserProfile;
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useUserProfileCache(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Vérifier le cache
        const cachedData = profileCache.get(userId);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setProfile(cachedData.profile);
          setLoading(false);
          return;
        }

        // Si pas en cache ou expiré, faire la requête
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        // Récupérer les données sociales en une seule requête
        const { data: socialData, error: socialError } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', userId);

        if (socialError) throw socialError;

        // Transformer les données
        const userProfile: UserProfile = {
          id: userData.id,
          name: userData.name,
          avatar: userData.avatar,
          rating: userData.rating,
          bio: userData.bio || '',
          location: userData.location,
          joinedDate: userData.joined_date,
          birthDate: userData.birth_date,
          interests: [], // On ne charge pas les intérêts car pas nécessaires dans la liste
          languages: [], // Pareil pour les langues
          stats: {
            eventsCreated: 0,
            eventsAttended: 0,
            averageRating: userData.rating,
            totalReviews: 0
          },
          verified: userData.verified,
          socialLinks: socialData.map(link => ({
            platform: link.platform,
            url: link.url,
            isPublic: link.is_public
          }))
        };

        // Mettre en cache
        profileCache.set(userId, {
          profile: userProfile,
          timestamp: Date.now()
        });

        setProfile(userProfile);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}