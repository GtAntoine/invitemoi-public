import { Event, User } from '../types/event';
import { addDays } from 'date-fns';

// Utilisateurs fictifs
const users: User[] = [
  {
    id: '1',
    name: 'Sophie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Thomas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.6
  },
  {
    id: '3',
    name: 'Emma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Lucas',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.7
  },
  {
    id: '5',
    name: 'Julie',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.9
  },
  {
    id: '6',
    name: 'Antoine',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.5
  },
  {
    id: '7',
    name: 'Marie',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 4.8
  }
];

// Fonction pour générer une date dans les 7 prochains jours
const getRandomFutureDate = () => {
  const daysToAdd = Math.floor(Math.random() * 7) + 1;
  return addDays(new Date(), daysToAdd).toISOString().split('T')[0];
};

// Événements fictifs
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Dîner au restaurant étoilé "L\'Étoile"',
    description: 'Je souhaite découvrir ce restaurant gastronomique qui vient d\'obtenir sa première étoile Michelin.',
    category: 'restaurant',
    date: getRandomFutureDate(),
    time: '20:00',
    location: '15 rue de la Paix, Paris',
    createdBy: users[0], // Sophie
    status: 'open',
    eventType: 'seeking-host',
    applicants: [
      {
        user: users[1],
        message: 'Je connais très bien ce restaurant et je serais ravi(e) de vous y inviter. J\'apprécie particulièrement leur carte des vins.',
        timestamp: new Date().toISOString(),
        status: 'pending'
      },
      {
        user: users[3],
        message: 'Je suis un habitué de ce restaurant et ce serait un plaisir de vous faire découvrir leurs spécialités.',
        timestamp: new Date().toISOString(),
        status: 'pending'
      },
      {
        user: users[5],
        message: 'Amateur de gastronomie, je serais enchanté de partager cette expérience culinaire avec vous.',
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    title: 'Exposition Van Gogh',
    description: 'J\'offre deux places pour l\'exposition Van Gogh au musée d\'Orsay. Amateur d\'art impressionniste recherché !',
    category: 'museum',
    date: getRandomFutureDate(),
    time: '14:30',
    location: 'Musée d\'Orsay, Paris',
    createdBy: users[0], // Sophie
    status: 'open',
    eventType: 'offering-host',
    applicants: [
      {
        user: users[2],
        message: 'Passionnée d\'art impressionniste, je serais enchantée de partager ce moment culturel avec vous.',
        timestamp: new Date().toISOString(),
        status: 'pending'
      },
      {
        user: users[4],
        message: 'Van Gogh est mon peintre préféré, j\'ai déjà visité plusieurs expositions le concernant.',
        timestamp: new Date().toISOString(),
        status: 'pending'
      },
      {
        user: users[6],
        message: 'Je suis étudiante en histoire de l\'art et ce serait un plaisir d\'échanger sur cette exposition.',
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
    ]
  },
  // Événements où Sophie a postulé
  {
    id: '6',
    title: 'Soirée Jazz au New Morning',
    description: 'Je propose d\'inviter quelqu\'un à découvrir un excellent quartet de jazz dans ce club mythique.',
    category: 'other',
    date: getRandomFutureDate(),
    time: '21:00',
    location: 'New Morning, Paris',
    createdBy: users[4], // Julie
    status: 'open',
    eventType: 'offering-host',
    applicants: []
  },
  {
    id: '7',
    title: 'Dîner gastronomique chez Guy Savoy',
    description: 'Je souhaite partager un moment d\'exception dans ce restaurant 3 étoiles.',
    category: 'restaurant',
    date: getRandomFutureDate(),
    time: '19:30',
    location: 'Restaurant Guy Savoy, Paris',
    createdBy: users[2], // Emma
    status: 'open',
    eventType: 'offering-host',
    applicants: [
      {
        user: users[0], // Sophie
        message: 'La gastronomie française est ma passion, ce serait un immense plaisir de partager ce moment avec vous.',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2h ago
        status: 'accepted'
      }
    ]
  },
  {
    id: '8',
    title: 'Avant-première au Grand Rex',
    description: 'Je cherche quelqu\'un pour m\'accompagner à l\'avant-première du nouveau Nolan.',
    category: 'cinema',
    date: getRandomFutureDate(),
    time: '20:30',
    location: 'Le Grand Rex, Paris',
    createdBy: users[3], // Lucas
    status: 'open',
    eventType: 'seeking-host',
    applicants: [
      {
        user: users[0], // Sophie
        message: 'Fan absolue de Christopher Nolan, je serais ravie de vous inviter à cette avant-première !',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3h ago
        status: 'rejected'
      }
    ]
  },
  {
    id: '9',
    title: 'Exposition Monet',
    description: 'À la recherche d\'un(e) passionné(e) d\'impressionnisme pour cette exposition exceptionnelle.',
    category: 'museum',
    date: getRandomFutureDate(),
    time: '15:00',
    location: 'Musée Marmottan Monet, Paris',
    createdBy: users[6], // Marie
    status: 'open',
    eventType: 'seeking-host',
    applicants: [
      {
        user: users[0], // Sophie
        message: 'En tant qu\'amatrice d\'art, je serais enchantée de vous faire découvrir ce musée que je connais très bien.',
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4h ago
        status: 'pending'
      }
    ]
  }
];