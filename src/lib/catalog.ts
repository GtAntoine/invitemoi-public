import {
  Clapperboard,
  Drama,
  Landmark,
  Music2,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import type { Category, OutingKind } from './types';

interface CategoryInfo {
  label: string;
  icon: LucideIcon;
  /** Fond « affiche » de la couverture, identique en clair et en sombre. */
  poster: string;
  /** Exemple de titre pour guider la création. */
  example: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  restaurant: { label: 'Resto', icon: UtensilsCrossed, poster: '#C2461F', example: 'Dîner au petit libanais de la rue Oberkampf' },
  theatre: { label: 'Théâtre', icon: Drama, poster: '#7A2E3B', example: 'Deux places pour Cyrano au Théâtre Montparnasse' },
  musee: { label: 'Expo', icon: Landmark, poster: '#2F5D50', example: "L'expo Rothko à la Fondation Louis Vuitton" },
  cinema: { label: 'Ciné', icon: Clapperboard, poster: '#24304F', example: 'Avant-première au Grand Rex' },
  concert: { label: 'Concert', icon: Music2, poster: '#5B3FB8', example: 'Concert de jazz au Duc des Lombards' },
  autre: { label: 'Autre', icon: Sparkles, poster: '#9A6A12', example: 'Atelier céramique un samedi matin' },
};

export const CATEGORY_ORDER: Category[] = ['restaurant', 'theatre', 'musee', 'cinema', 'concert', 'autre'];

/** Libellés vus depuis la personne qui crée l'annonce, puis depuis celle qui la lit. */
export const KINDS: Record<
  OutingKind,
  { badge: string; ownerVerb: string; createTitle: string; createHint: string; cta: string; ctaDone: string; applicantRole: string }
> = {
  offer: {
    badge: "J'invite",
    ownerVerb: 'invite',
    createTitle: "J'invite quelqu'un",
    createHint: 'Tu offres la sortie et tu choisis la personne qui t’accompagne.',
    cta: 'Je veux venir',
    ctaDone: 'Demande envoyée',
    applicantRole: 'invité·e',
  },
  wish: {
    badge: 'Invite-moi',
    ownerVerb: 'cherche un hôte',
    createTitle: 'Je me fais inviter',
    createHint: 'Tu proposes une envie de sortie, quelqu’un se propose de t’inviter.',
    cta: "Je l'invite",
    ctaDone: 'Proposition envoyée',
    applicantRole: 'hôte',
  },
};

export const CITIES = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes'];

export const INTERESTS = [
  'Cuisine du monde',
  'Vin nature',
  'Théâtre classique',
  'Stand-up',
  'Art contemporain',
  'Photographie',
  'Cinéma d’auteur',
  'Jazz',
  'Électro',
  'Opéra',
  'Littérature',
  'Architecture',
  'Street food',
  'Danse',
  'Design',
  'Histoire',
];

export const LANGUAGES = ['Français', 'Anglais', 'Espagnol', 'Italien', 'Allemand', 'Portugais', 'Arabe', 'Japonais'];

/** Teintes d'avatar, choisies pour rester lisibles avec un texte crème. */
export const AVATAR_TONES = ['#C2461F', '#7A2E3B', '#2F5D50', '#24304F', '#5B3FB8', '#9A6A12', '#8A3F6E', '#3E6A8A'];
