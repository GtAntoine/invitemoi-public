import { Event } from '../types/event';

export function transformEventData(event: any): Event {
  // Vérifier si les données minimales sont présentes
  if (!event || !event.id || !event.title) {
    throw new Error('Invalid event data');
  }

  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    category: event.category,
    date: event.date,
    time: event.time,
    location: event.location,
    city: event.city || '',
    createdBy: {
      id: event.creator?.id || 'anonymous',
      name: event.creator?.name || 'Anonyme',
      avatar: event.creator?.avatar || '',
      rating: event.creator?.rating || 0,
      socialLinks: event.creator?.social_links?.map((link: any) => ({
        platform: link.platform,
        url: link.url,
        isPublic: link.is_public
      })) || []
    },
    status: event.status || 'open',
    eventType: event.event_type,
    applicants: (event.applications || []).map((app: any) => ({
      user: {
        id: app.applicant?.id || 'anonymous',
        name: app.applicant?.name || 'Anonyme',
        avatar: app.applicant?.avatar || '',
        rating: app.applicant?.rating || 0,
        socialLinks: app.applicant?.social_links?.map((link: any) => ({
          platform: link.platform,
          url: link.url,
          isPublic: link.is_public
        })) || []
      },
      message: app.message || '',
      timestamp: app.created_at,
      status: app.status || 'pending',
      sharedSocialLinks: app.shared_social_links || [],
      tempContact: app.temp_contact
    }))
  };
}
