import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  dark_mode: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  push_enabled: false,
  email_enabled: true,
  dark_mode: false
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user?.id) return;

    try {
      const { data: existingPrefs, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error loading preferences:', fetchError);
        return;
      }

      if (existingPrefs) {
        setPreferences(existingPrefs);
      } else {
        // Create default preferences
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...DEFAULT_PREFERENCES
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating preferences:', insertError);
          return;
        }

        if (newPrefs) {
          setPreferences(newPrefs);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof UserPreferences, value: boolean) => {
    if (!user?.id) return false;
    
    try {
      // Utiliser upsert au lieu de update/insert séparés
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          [key]: value,
          // Inclure les autres préférences actuelles
          ...preferences,
          // Mais écraser avec la nouvelle valeur
          [key]: value
        });

      if (error) {
        console.error('Error updating preference:', error);
        return false;
      }

      // Mettre à jour l'état local
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));

      return true;
    } catch (error) {
      console.error('Error updating preference:', error);
      return false;
    }
  };

  return {
    preferences,
    loading,
    updatePreference
  };
}