import React, { createContext, useContext, useEffect, useState } from 'react';
import { Event, Application } from '../types/event';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { transformEventData } from '../utils/eventTransformers';
import { transformApplicationData } from '../utils/applicationTransformers';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { format } from 'date-fns';
import { sendApplicationNotification } from '../utils/notificationUtils';
import { useEventSubscription } from '../hooks/useEventSubscription';
import { useEventOperations } from '../hooks/useEventOperations';

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: Error | null;
  applyToEvent: (eventId: string, message: string, sharedSocialLinks: string[], tempContact?: string) => Promise<void>;
  updateApplicationStatus: (eventId: string, applicantId: string, status: Application['status']) => Promise<void>;
  deleteApplication: (eventId: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  fetchUserEvents: (userId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Utiliser les hooks personnalisés
  useEventSubscription(fetchEvents);
  const { applyToEvent, updateApplicationStatus, deleteApplication, deleteEvent } = useEventOperations(setEvents);

  async function fetchEvents() {
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
  }

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

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <LoadingScreen message="Chargement des événements..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage 
          message="Une erreur est survenue lors du chargement des événements" 
        />
      </div>
    );
  }

  const value = {
    events,
    loading,
    error,
    applyToEvent,
    updateApplicationStatus,
    deleteApplication,
    deleteEvent,
    fetchUserEvents,
    refetch: fetchEvents
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
}