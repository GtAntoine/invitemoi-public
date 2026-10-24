import { Dispatch, SetStateAction } from 'react';
import { Event, Application } from '../../types/event';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../AuthContext';
import { transformApplicationData } from '../../utils/applicationTransformers';
import { sendNotification } from '../../utils/notificationUtils';

export function useEventOperations(setEvents: Dispatch<SetStateAction<Event[]>>) {
  const { user } = useAuth();

  const applyToEvent = async (
    eventId: string,
    message: string,
    sharedSocialLinks: string[],
    tempContact?: string
  ) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { data, error: applicationError } = await supabase
        .from('applications')
        .insert({
          event_id: eventId,
          user_id: user.id,
          message,
          shared_social_links: sharedSocialLinks,
          temp_contact: tempContact,
          status: 'pending'
        })
        .select(`
          *,
          applicant:users(
            id,
            name,
            avatar,
            rating,
            social_links(*)
          )
        `)
        .single();

      if (applicationError) throw applicationError;

      // Send notification
      await sendNotification(eventId, user.id, message, 'application');

      const application = transformApplicationData(data);

      setEvents(currentEvents => 
        currentEvents.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              applicants: [...event.applicants, application]
            };
          }
          return event;
        })
      );
    } catch (err) {
      throw err;
    }
  };

  const updateApplicationStatus = async (
    eventId: string,
    applicantId: string,
    status: Application['status']
  ) => {
    try {
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status })
        .eq('event_id', eventId)
        .eq('user_id', applicantId);

      if (applicationError) throw applicationError;

      if (status === 'accepted') {
        // Update event status to matched
        const { error: eventError } = await supabase
          .from('events')
          .update({ status: 'matched' })
          .eq('id', eventId);

        if (eventError) throw eventError;

        // Send acceptance notification
        await sendNotification(eventId, applicantId, 'Your application has been accepted!', 'acceptance');
      }

      setEvents(currentEvents =>
        currentEvents.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              status: status === 'accepted' ? 'matched' : event.status,
              applicants: event.applicants.map(app =>
                app.user.id === applicantId ? { ...app, status } : app
              )
            };
          }
          return event;
        })
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteApplication = async (eventId: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(currentEvents =>
        currentEvents.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              applicants: event.applicants.filter(app => app.user.id !== user.id)
            };
          }
          return event;
        })
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
    } catch (err) {
      throw err;
    }
  };

  return {
    applyToEvent,
    updateApplicationStatus,
    deleteApplication,
    deleteEvent
  };
}