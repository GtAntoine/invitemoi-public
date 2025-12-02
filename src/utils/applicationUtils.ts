// src/utils/applicationUtils.ts
import { supabase } from '../lib/supabase';
import { transformApplicationData } from './applicationTransformers';

export async function submitApplication(
  eventId: string,
  userId: string,
  message: string,
  sharedSocialLinks: string[],
  tempContact?: string
) {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      event_id: eventId,
      user_id: userId,
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

  if (error) throw error;
  return transformApplicationData(data);
}
