import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { EventList } from '../components/EventList';
import { ApplicationModal } from '../components/ApplicationModal';
import { AddToHomeScreen } from '../components/AddToHomeScreen';
import { useEventContext } from '../contexts/event/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { BaseLayout } from '../layouts/BaseLayout';

export function HomePage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id || '');
  const { events, applyToEvent } = useEventContext();

  const handleApply = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleSubmitApplication = async (message: string, sharedSocialLinks: string[], tempContact?: string) => {
    if (!selectedEventId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await applyToEvent(selectedEventId, message, sharedSocialLinks, tempContact);
      setSelectedEventId(null);
    } catch (error) {
      console.error('Error applying to event:', error);
      alert('Une erreur est survenue lors de la candidature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen">
      <Header
        onSeekHost={() => navigate('/events/create/seeking-host')}
        onOfferHost={() => navigate('/events/create/offering-host')}
        onToggleDashboard={() => navigate('/dashboard')}
        onToggleProfile={() => navigate(`/profile/${user?.id}`)}
        onHome={() => {}}
        showDashboard={false}
        showProfile={false}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventList
          events={events}
          onApply={handleApply}
          onViewProfile={handleViewProfile}
          showingForms={false}
          onCreateEvent={() => {}}
          onCancelForm={() => {}}
          currentUserId={user?.id}
        />
      </main>

      {selectedEventId && profile && (
        <ApplicationModal
          onSubmit={handleSubmitApplication}
          onClose={() => setSelectedEventId(null)}
          isOffering={events.find(e => e.id === selectedEventId)?.eventType === 'offering-host'}
          socialLinks={profile.socialLinks}
        />
      )}

      <AddToHomeScreen />
    </div>
  );
}