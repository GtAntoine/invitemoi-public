import React, { useState } from 'react';
import { UserApplications } from './UserApplications';
import { translations } from '../../translations/fr';
import { CalendarHeart, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEventContext } from '../../contexts/event/EventContext';
import { useLocation } from 'react-router-dom';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { LoadingScreen } from '../ui/LoadingScreen';
import { NotificationBadge } from '../NotificationBadge';
import { useDashboardNotifications } from '../../hooks/useDashboardNotifications';
import clsx from 'clsx';
import { Event } from '../../types/event';
import { EventApplications } from './EventApplications';

interface UserDashboardProps {
  events: Event[];
  onAcceptApplicant: (eventId: string, applicantId: string) => void;
  onRejectApplicant: (eventId: string, applicantId: string) => void;
  onViewProfile: (userId: string) => void;
  onDeleteApplication: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function UserDashboard({ 
  events, 
  onAcceptApplicant, 
  onRejectApplicant,
  onViewProfile,
  onDeleteApplication,
  onDeleteEvent
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'applications'>('events');
  const [highlightedEvents, setHighlightedEvents] = useState<Set<string>>(new Set());
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [deleteApplicationId, setDeleteApplicationId] = useState<string | null>(null);
  const { dashboard } = translations;
  const { user } = useAuth();
  const location = useLocation();
  const { loading } = useEventContext();
  const { newApplications, newAcceptances } = useDashboardNotifications(events);
  
  // Events created by the user (both open and matched)
  const createdEvents = events
    .filter(event => 
      event.createdBy.id === user?.id && 
      (event.status === 'open' || event.status === 'matched')
    )
    .sort((a, b) => {
      // Trier par date de création décroissante (le plus récent en premier)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  
  // Events where the user has applied (excluding their own events)
  const appliedEvents = events
    .filter(event => 
      event.createdBy.id !== user?.id && 
      event.applicants.some(app => app.user.id === user?.id)
    )
    .map(event => ({
      event,
      application: event.applicants.find(app => app.user.id === user?.id)!
    }));

  // Gérer les événements à mettre en évidence
  React.useEffect(() => {
    const state = location.state as { newEventId?: string };
    if (state?.newEventId) {
      setHighlightedEvents(new Set([state.newEventId]));
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        setHighlightedEvents(new Set());
      }, 2000);
    }
  }, [location.state]);

  const handleDeleteEvent = async () => {
    if (!deleteEventId) return;
    try {
      await onDeleteEvent(deleteEventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Une erreur est survenue lors de la suppression de l\'événement');
    } finally {
      setDeleteEventId(null);
    }
  };

  const handleDeleteApplication = async () => {
    if (!deleteApplicationId) return;
    try {
      await onDeleteApplication(deleteApplicationId);
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Une erreur est survenue lors de la suppression de la candidature');
    } finally {
      setDeleteApplicationId(null);
    }
  };

  if (loading) {
    return <LoadingScreen message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between md:justify-start gap-4 mb-6">
        {[
          {
            id: 'events',
            label: 'Mes événements',
            icon: CalendarHeart,
            notificationCount: newApplications
          },
          {
            id: 'applications',
            label: 'Mes candidatures',
            icon: Send,
            notificationCount: newAcceptances
          }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'events' | 'applications')}
            className={clsx(
              'flex w-full md:w-auto items-center px-2 gap-2 py-2 text-sm rounded-lg transition-all duration-300',
              'relative',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
            {tab.notificationCount > 0 && (
              <NotificationBadge 
                count={tab.notificationCount} 
                className="bg-red-500"
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'events' ? (
        createdEvents.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-2 gap-6 [column-fill:_balance]">
            {createdEvents.map(event => (
              <div
                key={event.id}
                className={clsx(
                  'inline-block w-full mb-6 transform transition-all duration-500',
                  highlightedEvents.has(event.id) && 'animate-highlight'
                )}
              >
                <EventApplications
                  event={event}
                  onAcceptApplicant={onAcceptApplicant}
                  onRejectApplicant={onRejectApplicant}
                  onViewProfile={onViewProfile}
                  onDeleteEvent={() => setDeleteEventId(event.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{dashboard.empty}</p>
          </div>
        )
      ) : (
        appliedEvents.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-2 gap-6 [column-fill:_balance]">
            {appliedEvents.map(({ event, application }) => (
              <div key={event.id} className="inline-block w-full mb-6">
                <UserApplications
                  event={event}
                  application={application}
                  onViewProfile={onViewProfile}
                  onDeleteApplication={() => setDeleteApplicationId(event.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{dashboard.applicants.empty}</p>
          </div>
        )
      )}

      <ConfirmDialog
        isOpen={!!deleteEventId}
        title="Supprimer l'événement"
        message="Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDeleteEvent}
        onCancel={() => setDeleteEventId(null)}
        isDangerous
      />

      <ConfirmDialog
        isOpen={!!deleteApplicationId}
        title="Supprimer la candidature"
        message="Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDeleteApplication}
        onCancel={() => setDeleteApplicationId(null)}
        isDangerous
      />
    </div>
  );
}