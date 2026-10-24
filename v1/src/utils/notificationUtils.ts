import { supabase } from '../lib/supabase';

export type NotificationType = 'application' | 'acceptance';

/**
 * Send a notification for an event
 * @param eventId The ID of the event
 * @param applicantId The ID of the applicant
 * @param message The notification message
 * @param type The type of notification (application or acceptance)
 */
export async function sendNotification(
  eventId: string,
  applicantId: string,
  message: string,
  type: NotificationType
) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        eventId,
        applicantId,
        message,
        type,
      },
    });

    if (error) {
      console.error('Notification error:', error);
      return false;
    }

    return true;
  } catch (error) {
    // Log error but don't break the flow
    console.error('Error sending notification:', error);
    return false;
  }
}

// Re-export for backward compatibility
export const sendApplicationNotification = sendNotification;