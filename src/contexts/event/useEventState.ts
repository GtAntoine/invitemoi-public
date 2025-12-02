import { useState, useEffect } from 'react';
import { Event } from '../../types/event';
import { supabase } from '../../lib/supabase';
import { transformEventData } from '../../utils/eventTransformers';
import { format } from 'date-fns';
import { useEventSync } from './useEventSync';

export function useEventState() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      const now = new Date();
      const currentDate = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm:ss');

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          creator:users!events_created_by_fkey(*,
            social_links(*),
            birth_date
          ),
          applications(
            *,
            applicant:users(
              *,
              social_links(*)
            )
          )
        `)
        .or(
          `and(date.gt.${currentDate}),and(date.eq.${currentDate},time.gt.${currentTime})`
        )
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (eventsError) throw eventsError;

      const transformedEvents = eventsData.map(transformEventData);
      setEvents(transformedEvents);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEvents = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          creator:users!events_created_by_fkey(
            id,
            name,
            avatar,
            rating,
            birth_date,
            social_links(*)
          ),
          applications(
            *,
            applicant:users(
              id,
              name,
              avatar,
              rating,
              birth_date,
              social_links(*)
            )
          )
        `)
        .or(`created_by.eq.${userId},applications.user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      const transformedEvents = eventsData.map(transformEventData);
      setEvents(transformedEvents);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEventSync(fetchEvents);

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    setEvents,
    fetchEvents,
    fetchUserEvents
  };
}