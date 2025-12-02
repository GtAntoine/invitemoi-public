import { Application } from '../types/event';

export function transformApplicationData(data: any): Application {
  return {
    user: {
      id: data.applicant.id,
      name: data.applicant.name,
      avatar: data.applicant.avatar,
      rating: data.applicant.rating,
      socialLinks: data.applicant.social_links?.map((link: any) => ({
        platform: link.platform,
        url: link.url,
        isPublic: link.is_public
      }))
    },
    message: data.message,
    timestamp: data.created_at,
    status: data.status.trim(),
    sharedSocialLinks: data.shared_social_links || [],
    tempContact: data.temp_contact
  };
}