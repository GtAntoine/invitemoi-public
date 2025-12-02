// src/hooks/useEventForm.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Event, EventCategory, EventType } from '../types/event';

interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  eventType: EventType;
  city: string;
}

export function useEventForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createEvent = async (data: EventFormData) => {
    if (!user) {
      throw new Error('Vous devez être connecté pour créer un événement');
    }

    setLoading(true);
    setError(null);

    try {
      const { data: newEvent, error: eventError } = await supabase
        .from('events')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          date: data.date,
          time: data.time,
          location: data.location,
          city: data.city,
          created_by: user.id,
          event_type: data.eventType,
          status: 'open'
        })
        .select(`
          *,
          creator:users!events_created_by_fkey(*)
        `)
        .single();

      if (eventError) {
        throw new Error(eventError.message);
      }

      if (!newEvent) {
        throw new Error('Erreur lors de la création de l\'événement');
      }

      return {
        ...newEvent,
        createdBy: {
          id: newEvent.creator.id,
          name: newEvent.creator.name,
          avatar: newEvent.creator.avatar,
          rating: newEvent.creator.rating
        },
        applicants: []
      } as Event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    loading,
    error
  };
}
