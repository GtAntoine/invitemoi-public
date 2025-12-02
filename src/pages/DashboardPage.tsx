import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { UserDashboard } from '../components/Dashboard/UserDashboard';
import { useEventContext } from '../contexts/event/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { 
    events,
    loading,
    updateApplicationStatus,
    deleteApplication,
    deleteEvent,
    refetch
  } = useEventContext();

  // Scroll to top when navigating to dashboard with a new event
  useEffect(() => {
    const state = location.state as { newEventId?: string };
    if (state?.newEventId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    refetch();
  }, [location]);

  const handleAcceptApplicant = async (eventId: string, applicantId: string) => {
    try {
      await updateApplicationStatus(eventId, applicantId, 'accepted');
    } catch (error) {
      console.error('Error accepting applicant:', error);
      alert('Une erreur est survenue lors de l\'acceptation de la candidature');
    }
  };

  const handleRejectApplicant = async (eventId: string, applicantId: string) => {
    try {
      await updateApplicationStatus(eventId, applicantId, 'rejected');
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      alert('Une erreur est survenue lors du refus de la candidature');
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleDeleteApplication = async (eventId: string) => {
    try {
      await deleteApplication(eventId);
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Une erreur est survenue lors de la suppression de la candidature');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Une erreur est survenue lors de la suppression de l\'événement');
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        onSeekHost={() => navigate('/events/create/seeking-host')}
        onOfferHost={() => navigate('/events/create/offering-host')}
        onToggleDashboard={() => {}}
        onToggleProfile={() => navigate(`/profile/${user?.id}`)}
        onHome={() => navigate('/events')}
        showDashboard={true}
        showProfile={false}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserDashboard
          events={events}
          onAcceptApplicant={handleAcceptApplicant}
          onRejectApplicant={handleRejectApplicant}
          onViewProfile={handleViewProfile}
          onDeleteApplication={handleDeleteApplication}
          onDeleteEvent={handleDeleteEvent}
        />
      </main>
    </div>
  );
}