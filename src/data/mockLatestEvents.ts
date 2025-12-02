import { Event } from '../types/event';
import { addDays } from 'date-fns';

const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
const today = addDays(new Date(), 0).toISOString().split('T')[0];

export const mockLatestEvents: {
  seeking: Event;
  offering: Event;
} = {
  seeking: {
    id: 'mock-seeking',
    title: 'Soirée Jazz au Duc des Lombards',
    description: 'Amateur de jazz, je cherche quelqu\'un pour m\'accompagner découvrir ce club mythique et son ambiance unique. Au programme : un quartet exceptionnel et des standards revisités.',
    category: 'other',
    date: today,
    time: '20:30',
    location: 'Duc des Lombards, Paris',
    city: 'Paris',
    createdBy: {
      id: 'mock-user-1',
      name: 'Marie',
      avatar: '',
      rating: 0,
      socialLinks: []
    },
    status: 'open',
    eventType: 'seeking-host',
    applicants: []
  },
  offering: {
    id: 'mock-offering',
    title: 'Exposition Monet au Musée Marmottan',
    description: 'Je propose d\'inviter quelqu\'un à découvrir cette magnifique exposition dédiée aux Nymphéas de Monet. Amateur d\'art impressionniste bienvenu !',
    category: 'museum',
    date: tomorrow,
    time: '14:00',
    location: 'Musée Marmottan Monet, Paris',
    city: 'Paris',
    createdBy: {
      id: 'mock-user-2',
      name: 'Thomas',
      avatar: '',
      rating: 0,
      socialLinks: []
    },
    status: 'open',
    eventType: 'offering-host',
    applicants: []
  }
};
