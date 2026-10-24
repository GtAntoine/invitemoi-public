export type EventCategory = 'restaurant' | 'theater' | 'museum' | 'cinema' | 'other';
export type EventType = 'seeking-host' | 'offering-host';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface DateFilter {
  date: string;
  selected: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  socialLinks?: {
    platform: 'twitter' | 'instagram' | 'other';
    url: string;
    isPublic: boolean;
  }[];
}

export interface Application {
  user: User;
  message: string;
  timestamp: string;
  status: ApplicationStatus;
  sharedSocialLinks: string[];
  tempContact?: string;
}

export interface BaseEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  city: string;
  createdBy: User;
  status: 'open' | 'matched' | 'completed';
  eventType: EventType;
}

export interface SeekingHostEvent extends BaseEvent {
  eventType: 'seeking-host';
  applicants: Application[];
  selectedHost?: User;
}

export interface OfferingHostEvent extends BaseEvent {
  eventType: 'offering-host';
  applicants: Application[];
  selectedGuest?: User;
}

export type Event = SeekingHostEvent | OfferingHostEvent;