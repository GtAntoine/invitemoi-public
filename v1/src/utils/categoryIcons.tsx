import { Utensils, Theater, Building2, Film, Sparkles } from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  const icons = {
    restaurant: Utensils,
    theater: Theater,
    museum: Building2,
    cinema: Film,
    other: Sparkles
  };

  return icons[category as keyof typeof icons] || Sparkles;
};

export const getCategoryLabel = (category: string) => {
  const labels = {
    restaurant: 'Restaurant',
    theater: 'Théâtre',
    museum: 'Musée',
    cinema: 'Cinéma',
    other: 'Autre'
  };

  return labels[category as keyof typeof labels] || 'Autre';
};