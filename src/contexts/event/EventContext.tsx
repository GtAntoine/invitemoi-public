import React, { createContext, useContext } from 'react';
import { Event, Application } from '../../types/event';
import { useEventState } from './useEventState';
import { useEventOperations } from './useEventOperations';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

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
  const { events, loading, error, setEvents, fetchEvents, fetchUserEvents } = useEventState();
  const { applyToEvent, updateApplicationStatus, deleteApplication, deleteEvent } = useEventOperations(setEvents);

  if (loading) {
    return <LoadingScreen message="Chargement des événements..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage message="Une erreur est survenue lors du chargement des événements" />
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