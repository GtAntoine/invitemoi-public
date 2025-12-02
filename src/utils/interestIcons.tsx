import { 
  Utensils, Theater, Building2, Film, Camera, Music, BookOpen, 
  Palette, Mic2, Building, MonitorPlay, Library, History, 
  HeartHandshake, Sparkles
} from 'lucide-react';

export const getInterestIcon = (category: string) => {
  const icons: Record<string, typeof Utensils> = {
    'Gastronomie': Utensils,
    'Art contemporain': Palette,
    'Théâtre': Theater,
    'Musique classique': Music,
    'Cinéma': Film,
    'Photographie': Camera,
    'Histoire de l\'art': History,
    'Musées': Building2,
    'Opéra': Mic2,
    'Jazz': Music,
    'Architecture': Building,
    'Danse': HeartHandshake,
    'Arts numériques': MonitorPlay,
    'Littérature': Library,
    'Arts vivants': Theater,
    'Expositions': Building2,
    'Cinéma d\'auteur': Film,
    'Théâtre contemporain': Theater,
    'Théâtre classique': Theater,
  };

  return icons[category] || Sparkles;
};