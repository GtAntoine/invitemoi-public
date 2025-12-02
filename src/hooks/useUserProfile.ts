import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/user';

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [exists, setExists] = useState<boolean>(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') { // Code for "no rows returned"
          setExists(false);
          return;
        }
        throw userError;
      }

      setExists(true);

      // Fetch interests
      const { data: interests, error: interestsError } = await supabase
        .from('interests')
        .select('*')
        .eq('user_id', userId);

      if (interestsError) throw interestsError;

      // Fetch languages
      const { data: languages, error: languagesError } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', userId);

      if (languagesError) throw languagesError;

      // Fetch social links
      const { data: socialLinks, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', userId);

      if (socialError) throw socialError;

      // Count events created
      const { count: eventsCreated, error: eventsCreatedError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      if (eventsCreatedError) throw eventsCreatedError;

      // Count events attended (accepted applications)
      const { count: eventsAttended, error: eventsAttendedError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (eventsAttendedError) throw eventsAttendedError;

      // Transform database user into UserProfile type
      const userProfile: UserProfile = {
        id: userData.id,
        name: userData.name,
        avatar: userData.avatar,
        rating: userData.rating,
        bio: userData.bio || '',
        location: userData.location,
        joinedDate: userData.joined_date,
        birthDate: userData.birth_date,
        interests: interests.map(interest => ({
          category: interest.category,
          level: interest.level
        })),
        languages: languages.map(lang => lang.language),
        stats: {
          eventsCreated: eventsCreated || 0,
          eventsAttended: eventsAttended || 0,
          averageRating: userData.rating,
          totalReviews: 0 // We'll add this later when implementing reviews
        },
        verified: userData.verified,
        socialLinks: socialLinks.map(link => ({
          platform: link.platform as 'twitter' | 'instagram' | 'other',
          url: link.url,
          isPublic: link.is_public
        }))
      };

      setProfile(userProfile);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `created_by=eq.${userId}`
        },
        () => {
          fetchProfile();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProfile, userId]);

  return { profile, loading, error, exists, refetch: fetchProfile };
}