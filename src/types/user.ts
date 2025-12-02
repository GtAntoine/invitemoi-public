export interface UserStats {
  eventsCreated: number;
  eventsAttended: number;
  averageRating: number;
  totalReviews: number;
}

export interface UserInterest {
  category: string;
  level: 'casual' | 'interested' | 'passionate';
}

export interface SocialLink {
  platform: 'twitter' | 'instagram' | 'other';
  url: string;
  isPublic: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  bio: string;
  location: string;
  joinedDate: string;
  birthDate: string;
  interests: UserInterest[];
  languages: string[];
  stats: UserStats;
  verified: boolean;
  socialLinks: SocialLink[];
}