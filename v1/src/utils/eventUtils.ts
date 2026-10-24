import { Event } from '../types/event';
import { format, parseISO } from 'date-fns';

export function sortEventsByDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const dateA = parseISO(`${a.date}T${a.time}`);
    const dateB = parseISO(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
}

export function filterEventsByDates(events: Event[], selectedDates: string[]): Event[] {
  return events.filter(event => selectedDates.includes(event.date));
}

export function transformEventData(event: any): Event {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.date,
    time: event.time,
    location: event.location,
    city: event.city,
    createdBy: {
      id: event.creator.id,
      name: event.creator.name,
      avatar: event.creator.avatar,
      rating: event.creator.rating
    },
    status: event.status,
    eventType: event.event_type,
    applicants: []
  };
}