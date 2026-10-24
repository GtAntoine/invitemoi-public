import { addDays, formatISO, subDays, subHours, subMinutes } from 'date-fns';
import type { Application, DemoState, Outing, User } from './types';

export const SEED_VERSION = 3;
export const DEMO_USER_ID = 'u-camille';

const day = (offset: number) => formatISO(addDays(new Date(), offset), { representation: 'date' });
const ago = (minutes: number) => subMinutes(new Date(), minutes).toISOString();

const users: User[] = [
  {
    id: DEMO_USER_ID,
    firstName: 'Camille',
    age: 29,
    city: 'Paris',
    bio: 'Graphiste le jour, spectatrice le soir. Je garde toujours un œil sur la programmation des théâtres et je connais quelques bonnes caves à vin nature.',
    interests: ['Théâtre classique', 'Art contemporain', 'Vin nature', 'Jazz', 'Cinéma d’auteur', 'Littérature'],
    languages: ['Français', 'Anglais'],
    instagram: 'camille.sort',
    hosted: 6,
    attended: 9,
    rating: 4.9,
    verified: true,
    memberSince: subDays(new Date(), 240).toISOString(),
    tone: 0,
  },
  { id: 'u-thomas', firstName: 'Thomas', age: 34, city: 'Paris', bio: 'Chef de projet, gourmand assumé. J’adore faire découvrir les tables que j’aime.', interests: ['Cuisine du monde', 'Vin nature', 'Jazz', 'Architecture'], languages: ['Français', 'Anglais', 'Italien'], instagram: 'thomas.atable', hosted: 14, attended: 3, rating: 4.8, verified: true, memberSince: subDays(new Date(), 400).toISOString(), tone: 3 },
  { id: 'u-lea', firstName: 'Léa', age: 26, city: 'Paris', bio: 'Étudiante en histoire de l’art. Toujours partante pour une expo un dimanche.', interests: ['Art contemporain', 'Histoire', 'Photographie', 'Littérature'], languages: ['Français', 'Espagnol'], instagram: 'lea.musees', hosted: 1, attended: 7, rating: 4.7, verified: true, memberSince: subDays(new Date(), 120).toISOString(), tone: 2 },
  { id: 'u-hugo', firstName: 'Hugo', age: 31, city: 'Paris', bio: 'Prof de lettres, abonné à la Comédie-Française depuis mes 18 ans.', interests: ['Théâtre classique', 'Littérature', 'Opéra', 'Vin nature'], languages: ['Français', 'Allemand'], instagram: 'hugo.lit', hosted: 4, attended: 11, rating: 4.9, verified: true, memberSince: subDays(new Date(), 300).toISOString(), tone: 4 },
  { id: 'u-ines', firstName: 'Inès', age: 28, city: 'Paris', bio: 'Comédienne amateur, je joue dans une troupe à Belleville.', interests: ['Théâtre classique', 'Danse', 'Stand-up'], languages: ['Français', 'Arabe', 'Anglais'], instagram: 'ines.scene', hosted: 2, attended: 5, rating: 4.6, verified: false, memberSince: subDays(new Date(), 60).toISOString(), tone: 6 },
  { id: 'u-malik', firstName: 'Malik', age: 33, city: 'Paris', bio: 'Ingénieur son. Je découvre le théâtre depuis un an et j’en redemande.', interests: ['Jazz', 'Électro', 'Cinéma d’auteur'], languages: ['Français', 'Anglais'], instagram: 'malik.sound', hosted: 3, attended: 2, rating: 4.5, verified: true, memberSince: subDays(new Date(), 90).toISOString(), tone: 7 },
  { id: 'u-sofia', firstName: 'Sofia', age: 30, city: 'Paris', bio: 'Italienne installée à Paris depuis deux ans, j’apprends la ville une sortie à la fois.', interests: ['Opéra', 'Art contemporain', 'Cuisine du monde', 'Design'], languages: ['Italien', 'Français', 'Anglais'], instagram: 'sofia.aparigi', hosted: 0, attended: 4, rating: 4.8, verified: true, memberSince: subDays(new Date(), 45).toISOString(), tone: 5 },
  { id: 'u-julien', firstName: 'Julien', age: 37, city: 'Paris', bio: 'Je connais tous les brunchs du 11e. Si tu cherches un bon plan, demande.', interests: ['Street food', 'Cuisine du monde', 'Photographie'], languages: ['Français', 'Anglais'], instagram: 'julien.brunch', hosted: 9, attended: 2, rating: 4.7, verified: true, memberSince: subDays(new Date(), 500).toISOString(), tone: 1 },
  { id: 'u-nora', firstName: 'Nora', age: 32, city: 'Paris', bio: 'Avocate, cuisinière du dimanche, toujours à l’affût d’une nouvelle adresse.', interests: ['Cuisine du monde', 'Vin nature', 'Littérature'], languages: ['Français', 'Anglais', 'Portugais'], instagram: 'nora.goute', hosted: 7, attended: 4, rating: 5, verified: true, memberSince: subDays(new Date(), 210).toISOString(), tone: 2 },
  { id: 'u-yanis', firstName: 'Yanis', age: 25, city: 'Lyon', bio: 'Étudiant en archi, fan de concerts dans les petites salles.', interests: ['Électro', 'Architecture', 'Design'], languages: ['Français', 'Anglais'], hosted: 2, attended: 6, rating: 4.6, verified: false, memberSince: subDays(new Date(), 30).toISOString(), tone: 4 },
  { id: 'u-margaux', firstName: 'Margaux', age: 35, city: 'Bordeaux', bio: 'Œnologue. Je fais goûter, tu racontes.', interests: ['Vin nature', 'Cuisine du monde', 'Histoire'], languages: ['Français', 'Anglais', 'Espagnol'], instagram: 'margaux.cave', hosted: 18, attended: 1, rating: 4.9, verified: true, memberSince: subDays(new Date(), 700).toISOString(), tone: 0 },
  { id: 'u-adrien', firstName: 'Adrien', age: 29, city: 'Marseille', bio: 'Photographe, je cherche des gens pour découvrir les expos de la ville.', interests: ['Photographie', 'Art contemporain', 'Street food'], languages: ['Français'], hosted: 1, attended: 3, rating: 4.4, verified: true, memberSince: subDays(new Date(), 75).toISOString(), tone: 3 },
  { id: 'u-chloe', firstName: 'Chloé', age: 27, city: 'Paris', bio: 'Cinéphile, je vais voir au moins deux films par semaine.', interests: ['Cinéma d’auteur', 'Littérature', 'Stand-up'], languages: ['Français', 'Anglais', 'Japonais'], instagram: 'chloe.cine', hosted: 5, attended: 8, rating: 4.8, verified: true, memberSince: subDays(new Date(), 180).toISOString(), tone: 6 },
  { id: 'u-karim', firstName: 'Karim', age: 40, city: 'Lille', bio: 'Musicien de jazz, je connais les meilleures jam sessions de Lille.', interests: ['Jazz', 'Opéra', 'Cuisine du monde'], languages: ['Français', 'Arabe', 'Anglais'], instagram: 'karim.jazz', hosted: 11, attended: 4, rating: 4.9, verified: true, memberSince: subDays(new Date(), 365).toISOString(), tone: 7 },
];

const outings: Outing[] = [
  // Annonces de Camille
  { id: 'o-misanthrope', kind: 'offer', category: 'theatre', title: 'Deux places pour Le Misanthrope', description: 'J’ai deux places au parterre et ma partenaire de théâtre habituelle est en déplacement. Idéalement quelqu’un qui aime Molière et qui est partant pour un verre après.', venue: 'Comédie-Française', city: 'Paris', date: day(2), time: '20:30', ownerId: DEMO_USER_ID, createdAt: ago(60 * 26) },
  { id: 'o-brunch', kind: 'wish', category: 'restaurant', title: 'Le brunch du dimanche chez Mirabelle', description: 'On m’en parle depuis des semaines. Je ramène la bonne humeur et les potins de l’expo Rothko.', venue: 'Café Mirabelle, Paris 11e', city: 'Paris', date: day(5), time: '11:30', ownerId: DEMO_USER_ID, createdAt: ago(60 * 8) },

  // Annonces des autres
  { id: 'o-septime', kind: 'offer', category: 'restaurant', title: 'Menu dégustation chez Septime', description: 'Une réservation pour deux que j’ai mis trois semaines à décrocher. Je cherche quelqu’un de curieux, qui mange de tout et aime parler cuisine.', venue: 'Septime, rue de Charonne', city: 'Paris', date: day(1), time: '20:00', ownerId: 'u-thomas', createdAt: ago(60 * 30) },
  { id: 'o-rothko', kind: 'wish', category: 'musee', title: 'L’expo Rothko un dimanche matin', description: 'Je rêve de la voir mais le billet pique un peu pour mon budget d’étudiante. Je peux te raconter l’histoire de chaque toile.', venue: 'Fondation Louis Vuitton', city: 'Paris', date: day(4), time: '10:30', ownerId: 'u-lea', createdAt: ago(60 * 5) },
  { id: 'o-jazz', kind: 'offer', category: 'concert', title: 'Soirée jazz au Duc des Lombards', description: 'Un trio que j’ai découvert l’an dernier, ils sont incroyables en live. Je t’invite, tu me fais découvrir un artiste en échange ?', venue: 'Duc des Lombards', city: 'Paris', date: day(3), time: '21:00', ownerId: 'u-malik', createdAt: ago(90) },
  { id: 'o-rex', kind: 'wish', category: 'cinema', title: 'Avant-première au Grand Rex', description: 'Le nouveau film de Céline Sciamma passe en avant-première avec l’équipe. Quelqu’un pour m’y emmener ?', venue: 'Le Grand Rex', city: 'Paris', date: day(2), time: '19:45', ownerId: 'u-chloe', createdAt: ago(60 * 3) },
  { id: 'o-bouillon', kind: 'offer', category: 'restaurant', title: 'Déjeuner au Bouillon Chartier', description: 'Une institution que tout le monde devrait connaître. Je t’invite pour un déjeuner simple et bavard.', venue: 'Bouillon Chartier, Grands Boulevards', city: 'Paris', date: day(0), time: '12:30', ownerId: 'u-julien', createdAt: ago(45) },
  { id: 'o-opera', kind: 'wish', category: 'theatre', title: 'La Traviata à l’Opéra Bastille', description: 'Mon opéra préféré, que je n’ai jamais vu sur scène. Je te promets de ne pas chanter pendant le spectacle.', venue: 'Opéra Bastille', city: 'Paris', date: day(6), time: '19:30', ownerId: 'u-sofia', createdAt: ago(60 * 12) },
  { id: 'o-ceramique', kind: 'offer', category: 'autre', title: 'Atelier céramique pour deux', description: 'J’ai gagné un atelier duo de tournage. Aucun talent requis, juste l’envie de mettre les mains dans l’argile.', venue: 'Atelier Terre & Feu, Paris 20e', city: 'Paris', date: day(5), time: '14:00', ownerId: 'u-nora', createdAt: ago(60 * 20) },
  { id: 'o-sucriere', kind: 'offer', category: 'concert', title: 'Concert électro à La Sucrière', description: 'Deux places pour un line-up techno au bord de la Saône. Je cherche quelqu’un qui danse jusqu’à la fin.', venue: 'La Sucrière', city: 'Lyon', date: day(3), time: '22:00', ownerId: 'u-yanis', createdAt: ago(60 * 7) },
  { id: 'o-cave', kind: 'offer', category: 'restaurant', title: 'Dégustation dans une cave des Chartrons', description: 'Six vins nature, des fromages, et toutes les histoires de vignerons que tu veux. Je m’occupe de tout.', venue: 'Cave des Chartrons', city: 'Bordeaux', date: day(2), time: '19:00', ownerId: 'u-margaux', createdAt: ago(60 * 15) },
  { id: 'o-mucem', kind: 'wish', category: 'musee', title: 'Le MuCEM et un coucher de soleil', description: 'Nouvelle expo photo au MuCEM. Je propose d’enchaîner avec une balade sur le fort Saint-Jean.', venue: 'MuCEM', city: 'Marseille', date: day(1), time: '17:00', ownerId: 'u-adrien', createdAt: ago(60 * 9) },
  { id: 'o-jam', kind: 'offer', category: 'concert', title: 'Jam session au Ballroom', description: 'Je joue ce soir-là et j’ai une place en coulisses. Ambiance garantie, même si tu ne connais rien au jazz.', venue: 'Le Ballroom', city: 'Lille', date: day(4), time: '20:30', ownerId: 'u-karim', createdAt: ago(60 * 4) },
  { id: 'o-standup', kind: 'wish', category: 'theatre', title: 'Plateau stand-up au Point Virgule', description: 'Envie de rire un bon coup en milieu de semaine. Je paie les verres après si tu m’invites au spectacle.', venue: 'Le Point Virgule', city: 'Paris', date: day(3), time: '20:00', ownerId: 'u-ines', createdAt: ago(60 * 2) },
];

const app = (
  id: string,
  outingId: string,
  userId: string,
  message: string,
  minutesAgo: number,
  extra: Partial<Application> = {},
): Application => ({
  id,
  outingId,
  userId,
  message,
  shareInstagram: true,
  status: 'pending',
  createdAt: ago(minutesAgo),
  seenByOwner: false,
  seenByApplicant: true,
  ...extra,
});

const applications: Application[] = [
  // Candidatures reçues par Camille sur Le Misanthrope
  app('a-hugo', 'o-misanthrope', 'u-hugo', 'Je connais la mise en scène par cœur, mais je ne m’en lasse jamais. Et je connais un bar à vin nature juste à côté pour l’après !', 40),
  app('a-ines', 'o-misanthrope', 'u-ines', 'Je joue Célimène dans ma troupe amateur cette année, voir la version de la Comédie-Française serait un rêve.', 180),
  app('a-malik', 'o-misanthrope', 'u-malik', 'Je n’ai jamais vu de Molière en vrai, j’aimerais bien commencer par celui-là. Partant pour le verre après.', 300, { seenByOwner: true }),
  app('a-sofia', 'o-misanthrope', 'u-sofia', 'J’ai lu la pièce en italien au lycée. Je serais ravie de la découvrir en français, avec quelqu’un qui connaît.', 420, { seenByOwner: true }),

  // Propositions d'hôtes pour le brunch de Camille
  app('a-julien', 'o-brunch', 'u-julien', 'Mirabelle, c’est mon QG ! Je t’invite volontiers, je te conseille les œufs brouillés à la truffe.', 120),
  app('a-nora', 'o-brunch', 'u-nora', 'J’y vais souvent le dimanche, ce serait un plaisir de t’inviter. On parlera expo, j’ai adoré Rothko.', 260, { seenByOwner: true }),

  // Demandes envoyées par Camille
  app('a-camille-septime', 'o-septime', DEMO_USER_ID, 'Septime est sur ma liste depuis des années ! Je mange de tout, et j’adore poser mille questions sur les plats.', 60 * 20, { status: 'accepted', seenByApplicant: false, seenByOwner: true }),
  app('a-camille-rothko', 'o-rothko', DEMO_USER_ID, 'Je l’ai vue la semaine dernière et j’y retournerais avec plaisir. Je t’invite, et tu me racontes les toiles.', 60 * 3, { seenByOwner: true }),

  // Autres candidatures, pour donner de la vie au fil
  app('a-x1', 'o-septime', 'u-nora', 'Grande fan de la cuisine de Bertrand Grébaut.', 60 * 25, { status: 'declined' }),
  app('a-x2', 'o-jazz', 'u-chloe', 'Je découvre le jazz, ça me tente beaucoup.', 30),
  app('a-x3', 'o-jazz', 'u-hugo', 'Le Duc des Lombards, quelle adresse !', 50),
  app('a-x4', 'o-rex', 'u-malik', 'Je t’y emmène avec plaisir.', 100),
  app('a-x5', 'o-bouillon', 'u-sofia', 'Je n’y suis jamais allée !', 20),
  app('a-x6', 'o-opera', 'u-hugo', 'Je t’invite, c’est aussi mon opéra préféré.', 60 * 6),
  app('a-x7', 'o-opera', 'u-thomas', 'Avec plaisir, j’ai un abonnement.', 60 * 8),
  app('a-x8', 'o-ceramique', 'u-lea', 'J’ai toujours voulu essayer !', 60 * 10),
  app('a-x9', 'o-standup', 'u-julien', 'Je t’invite, j’adore ce plateau.', 60),
];

export function createSeed(): DemoState {
  return {
    version: SEED_VERSION,
    meId: null,
    users: Object.fromEntries(users.map((u) => [u.id, u])),
    outings,
    applications,
    activity: [
      { id: 'act-1', type: 'accepted', outingId: 'o-septime', userId: 'u-thomas', createdAt: subHours(new Date(), 2).toISOString(), read: false },
      { id: 'act-2', type: 'new-application', outingId: 'o-misanthrope', userId: 'u-hugo', createdAt: ago(40), read: false },
      { id: 'act-3', type: 'new-application', outingId: 'o-brunch', userId: 'u-julien', createdAt: ago(120), read: false },
      { id: 'act-4', type: 'new-application', outingId: 'o-misanthrope', userId: 'u-ines', createdAt: ago(180), read: true },
    ],
    scheduled: [],
  };
}

/** Candidats simulés qui répondent aux nouvelles annonces créées pendant la démo. */
export const SIMULATED_RESPONDERS: { userId: string; offer: string; wish: string }[] = [
  { userId: 'u-hugo', offer: 'Ton annonce m’a tout de suite parlé. Je suis du genre ponctuel et bavard, dans le bon sens !', wish: 'Je t’invite avec plaisir, c’est exactement le genre de sortie que j’aime partager.' },
  { userId: 'u-sofia', offer: 'Ce serait une super découverte pour moi. Je promets d’apporter la bonne humeur italienne.', wish: 'Je serais ravie de t’inviter, on se retrouve sur place ?' },
  { userId: 'u-chloe', offer: 'J’adorerais venir ! On a l’air d’avoir pas mal de goûts en commun.', wish: 'Je t’invite, et je connais un super café juste à côté pour finir.' },
  { userId: 'u-malik', offer: 'Partant ! Je suis nouveau dans ce genre de sorties, mais très curieux.', wish: 'Avec plaisir, c’est moi qui invite cette fois.' },
];
