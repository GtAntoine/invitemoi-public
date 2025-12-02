// src/pages/CreateEventPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { SeekingHostForm } from '../components/SeekingHostForm';
import { OfferingHostForm } from '../components/OfferingHostForm';
import { useEventForm } from '../hooks/useEventForm';
import { useEventContext } from '../contexts/event/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useScrollTop } from '../hooks/useScrollTop';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const { user } = useAuth();
  const { createEvent, loading, error } = useEventForm();
  const { refetch } = useEventContext();
  useScrollTop();

  const handleCreateEvent = async (eventData: any) => {
    try {
      const newEvent = await createEvent(eventData);
      if (newEvent) {
        // Refetch events before navigating
        await refetch();
        
        // Navigate to dashboard with the new event ID
        navigate('/dashboard', { 
          state: { newEventId: newEvent.id },
          replace: true 
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      // The error will be handled by the form components through the error state
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        onSeekHost={() => navigate('/events/create/seeking-host')}
        onOfferHost={() => navigate('/events/create/offering-host')}
        onToggleDashboard={() => navigate('/dashboard')}
        onToggleProfile={() => navigate(`/profile/${user?.id}`)}
        onHome={() => navigate('/events')}
        showDashboard={false}
        showProfile={false}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {type === 'seeking-host' ? (
          <SeekingHostForm
            onSubmit={handleCreateEvent}
            onCancel={() => navigate('/events')}
            error={error}
            loading={loading}
          />
        ) : type === 'offering-host' ? (
          <OfferingHostForm
            onSubmit={handleCreateEvent}
            onCancel={() => navigate('/events')}
            error={error}
            loading={loading}
          />
        ) : null}
      </main>
    </div>
  );
}
