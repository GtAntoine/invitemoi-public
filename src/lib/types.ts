export type OutingKind = 'offer' | 'wish';
// offer : « J'invite » (le créateur offre la sortie)
// wish  : « Invite-moi » (le créateur cherche quelqu'un qui l'invite)

export type Category = 'restaurant' | 'theatre' | 'musee' | 'cinema' | 'concert' | 'autre';

export type ApplicationStatus = 'pending' | 'accepted' | 'declined';

export interface User {
  id: string;
  firstName: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  languages: string[];
  instagram?: string;
  hosted: number;
  attended: number;
  rating: number;
  verified: boolean;
  memberSince: string;
  tone: number;
}

export interface Outing {
  id: string;
  kind: OutingKind;
  category: Category;
  title: string;
  description: string;
  venue: string;
  city: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  ownerId: string;
  createdAt: string;
}

export interface Application {
  id: string;
  outingId: string;
  userId: string;
  message: string;
  shareInstagram: boolean;
  status: ApplicationStatus;
  createdAt: string;
  seenByOwner: boolean;
  seenByApplicant: boolean;
}

export type ActivityType = 'new-application' | 'accepted' | 'declined' | 'welcome';

export interface Activity {
  id: string;
  type: ActivityType;
  outingId?: string;
  userId?: string;
  createdAt: string;
  read: boolean;
}

export interface ScheduledEvent {
  id: string;
  dueAt: number;
  action:
    | { type: 'incoming-application'; outingId: string; userId: string; message: string }
    | { type: 'owner-responds'; applicationId: string; accept: boolean };
}

export interface DemoState {
  version: number;
  meId: string | null;
  users: Record<string, User>;
  outings: Outing[];
  applications: Application[];
  activity: Activity[];
  scheduled: ScheduledEvent[];
}
