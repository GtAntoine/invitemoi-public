import { UserProfile } from '../types/user';

export const mockProfiles: Record<string, UserProfile> = {
  '1': {
    id: '1',
    name: 'Sophie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 4.8,
    bio: `Passionnée d'art et de culture, j'aime découvrir de nouveaux endroits et partager des moments conviviaux. 
    
Amateur de bonne cuisine, je suis toujours partante pour tester de nouveaux restaurants ou découvrir des expositions intéressantes.

J'apprécie particulièrement les discussions enrichissantes autour d'un bon verre de vin ou d'un café.`,
    location: 'Paris, France',
    joinedDate: '2023-09-15',
    birthDate: '1992-05-15',
    interests: [
      { category: 'Gastronomie', level: 'passionate' },
      { category: 'Art contemporain', level: 'passionate' },
      { category: 'Théâtre', level: 'interested' },
      { category: 'Musique classique', level: 'interested' },
      { category: 'Cinéma', level: 'casual' },
      { category: 'Photographie', level: 'casual' }
    ],
    languages: ['Français', 'Anglais', 'Espagnol'],
    stats: {
      eventsCreated: 12,
      eventsAttended: 28,
      averageRating: 4.8,
      totalReviews: 15
    },
    verified: true,
    socialLinks: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/sophie_art',
        isPublic: true
      },
      {
        platform: 'instagram',
        url: 'https://instagram.com/sophie.culture',
        isPublic: true
      },
      {
        platform: 'other',
        url: 'https://linkedin.com/in/sophie',
        isPublic: false
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Thomas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.6,
    bio: `Amateur de culture sous toutes ses formes, je suis un grand passionné d'art et d'histoire. 
    
J'aime partager mes découvertes et échanger avec des personnes qui ont la même curiosité pour les arts.

Toujours à la recherche de nouvelles expériences culturelles enrichissantes.`,
    location: 'Paris, France',
    joinedDate: '2023-10-01',
    birthDate: '1988-09-22',
    interests: [
      { category: 'Histoire de l\'art', level: 'passionate' },
      { category: 'Musées', level: 'passionate' },
      { category: 'Opéra', level: 'interested' },
      { category: 'Gastronomie', level: 'interested' },
      { category: 'Jazz', level: 'casual' },
      { category: 'Architecture', level: 'casual' }
    ],
    languages: ['Français', 'Anglais', 'Italien'],
    stats: {
      eventsCreated: 8,
      eventsAttended: 15,
      averageRating: 4.6,
      totalReviews: 12
    },
    verified: true,
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://instagram.com/thomas.art',
        isPublic: true
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Emma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.9,
    bio: `Cinéphile passionnée et amatrice de théâtre contemporain. 
    
J'adore découvrir de nouveaux talents et partager mes coups de cœur culturels.

Le cinéma d'auteur et les pièces avant-gardistes sont mes domaines de prédilection.`,
    location: 'Paris, France',
    joinedDate: '2023-11-20',
    birthDate: '1995-03-10',
    interests: [
      { category: 'Cinéma d\'auteur', level: 'passionate' },
      { category: 'Théâtre contemporain', level: 'passionate' },
      { category: 'Arts vivants', level: 'interested' },
      { category: 'Littérature', level: 'interested' },
      { category: 'Expositions', level: 'casual' },
      { category: 'Danse', level: 'casual' }
    ],
    languages: ['Français', 'Anglais', 'Allemand'],
    stats: {
      eventsCreated: 15,
      eventsAttended: 22,
      averageRating: 4.9,
      totalReviews: 18
    },
    verified: true,
    socialLinks: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/emma_cine',
        isPublic: true
      },
      {
        platform: 'instagram',
        url: 'https://instagram.com/emma.theatre',
        isPublic: true
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Lucas',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.7,
    bio: `Mélomane et amateur de jazz, je suis toujours à la recherche de nouvelles expériences musicales. 
    
J'aime particulièrement découvrir de nouveaux lieux culturels et partager ma passion pour la musique.

Amateur de bonnes tables, j'apprécie aussi les soirées conviviales autour d'un bon repas.`,
    location: 'Paris, France',
    joinedDate: '2023-08-30',
    birthDate: '1990-11-28',
    interests: [
      { category: 'Jazz', level: 'passionate' },
      { category: 'Musique live', level: 'passionate' },
      { category: 'Gastronomie', level: 'interested' },
      { category: 'Concerts', level: 'interested' },
      { category: 'Art contemporain', level: 'casual' },
      { category: 'Cinéma', level: 'casual' }
    ],
    languages: ['Français', 'Anglais'],
    stats: {
      eventsCreated: 10,
      eventsAttended: 20,
      averageRating: 4.7,
      totalReviews: 14
    },
    verified: true,
    socialLinks: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/lucas_jazz',
        isPublic: true
      }
    ]
  },
  '5': {
    id: '5',
    name: 'Julie',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.9,
    bio: `Danseuse et passionnée d'art vivant, je suis constamment à la recherche de nouvelles expériences culturelles.

J'aime particulièrement découvrir de nouveaux spectacles et partager des moments authentiques autour de la danse et du théâtre.

La gastronomie et l'art contemporain font aussi partie de mes centres d'intérêt.`,
    location: 'Paris, France',
    joinedDate: '2023-07-15',
    birthDate: '1994-08-12',
    interests: [
      { category: 'Danse contemporaine', level: 'passionate' },
      { category: 'Arts vivants', level: 'passionate' },
      { category: 'Gastronomie', level: 'interested' },
      { category: 'Art contemporain', level: 'interested' },
      { category: 'Photographie', level: 'casual' },
      { category: 'Musique classique', level: 'casual' }
    ],
    languages: ['Français', 'Anglais', 'Russe'],
    stats: {
      eventsCreated: 18,
      eventsAttended: 25,
      averageRating: 4.9,
      totalReviews: 20
    },
    verified: true,
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://instagram.com/julie.dance',
        isPublic: true
      },
      {
        platform: 'other',
        url: 'https://julie-dance.com',
        isPublic: true
      }
    ]
  },
  '6': {
    id: '6',
    name: 'Antoine',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.5,
    bio: `Photographe passionné et amateur de cinéma, j'aime capturer et partager des moments uniques.

Je suis toujours partant pour découvrir de nouvelles expositions ou assister à des projections de films indépendants.

La cuisine du monde et les arts numériques font également partie de mes passions.`,
    location: 'Paris, France',
    joinedDate: '2023-06-20',
    birthDate: '1991-12-05',
    interests: [
      { category: 'Photographie', level: 'passionate' },
      { category: 'Cinéma', level: 'passionate' },
      { category: 'Arts numériques', level: 'interested' },
      { category: 'Cuisine du monde', level: 'interested' },
      { category: 'Expositions', level: 'casual' },
      { category: 'Théâtre', level: 'casual' }
    ],
    languages: ['Français', 'Anglais', 'Japonais'],
    stats: {
      eventsCreated: 14,
      eventsAttended: 19,
      averageRating: 4.5,
      totalReviews: 16
    },
    verified: true,
    socialLinks: [
      {
        platform: 'instagram',
        url: 'https://instagram.com/antoine.photo',
        isPublic: true
      },
      {
        platform: 'other',
        url: 'https://antoine-photo.com',
        isPublic: true
      }
    ]
  },
  '7': {
    id: '7',
    name: 'Marie',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 4.8,
    bio: `Historienne de l'art et grande amatrice de musées, je suis passionnée par le partage de connaissances culturelles.

J'adore organiser des visites guidées personnalisées et découvrir de nouveaux lieux culturels avec des personnes curieuses.

Le théâtre classique et l'opéra sont aussi des domaines qui me passionnent.`,
    location: 'Paris, France',
    joinedDate: '2023-05-10',
    birthDate: '1993-04-18',
    interests: [
      { category: 'Histoire de l\'art', level: 'passionate' },
      { category: 'Musées', level: 'passionate' },
      { category: 'Théâtre classique', level: 'interested' },
      { category: 'Opéra', level: 'interested' },
      { category: 'Architecture', level: 'casual' },
      { category: 'Littérature', level: 'casual' }
    ],
    languages: ['Français', 'Anglais', 'Italien', 'Latin'],
    stats: {
      eventsCreated: 20,
      eventsAttended: 30,
      averageRating: 4.8,
      totalReviews: 22
    },
    verified: true,
    socialLinks: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/marie_art',
        isPublic: true
      },
      {
        platform: 'instagram',
        url: 'https://instagram.com/marie.musees',
        isPublic: true
      }
    ]
  }
};

export const mockProfile = mockProfiles['1'];