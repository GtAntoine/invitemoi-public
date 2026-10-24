import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from '../types/event';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { transformEventData } from '../utils/eventTransformers';

const EVENTS_LIMIT = 200;

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  const fetchEvents = async () => {
    try {
      const now = new Date();
      const currentDate = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm:ss');

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          creator:users!events_created_by_fkey(*),
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
        .order('time', { ascending: true })
        .limit(EVENTS_LIMIT);

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

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== eventId));
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  const fetchUserEvents = async (userId: string) => {
    try {
      setLoading(true);
      const [createdEvents, appliedEvents] = await Promise.all([
        supabase
          .from('events')
          .select(`
            *,
            creator:users!events_created_by_fkey(*),
            applications(
              *,
              applicant:users(
                *,
                social_links(*)
              )
            )
          `)
          .eq('created_by', userId)
          .order('created_at', { ascending: false }),

        supabase
          .from('events')
          .select(`
            *,
            creator:users!events_created_by_fkey(*),
            applications(
              *,
              applicant:users(
                *,
                social_links(*)
              )
            )
          `)
          .neq('created_by', userId)
          .eq('applications.user_id', userId)
          .order('created_at', { ascending: false })
      ]);

      if (createdEvents.error) throw createdEvents.error;
      if (appliedEvents.error) throw appliedEvents.error;

      const allEvents = [...(createdEvents.data || []), ...(appliedEvents.data || [])];
      const transformedEvents = allEvents.map(transformEventData);
      
      setEvents(transformedEvents);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDashboard && user?.id) {
      fetchUserEvents(user.id);
    } else if (!isDashboard) {
      fetchEvents();
    }
  }, [user?.id, isDashboard]);

  return {
    events,
    loading,
    error,
    deleteEvent,
    fetchUserEvents,
    refetch: fetchEvents
  };
}