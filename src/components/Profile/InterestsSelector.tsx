import React from 'react';
import { UserInterest } from '../../types/user';
import { translations } from '../../translations/fr';
import { getInterestIcon } from '../../utils/interestIcons';
import clsx from 'clsx';

interface InterestsSelectorProps {
  selectedInterests: UserInterest[];
  onInterestsChange: (interests: UserInterest[]) => void;
}

const AVAILABLE_INTERESTS = [
  'Gastronomie',
  'Art contemporain',
  'Théâtre',
  'Musique classique',
  'Cinéma',
  'Photographie',
  'Histoire de l\'art',
  'Musées',
  'Opéra',
  'Jazz',
  'Architecture',
  'Danse',
  'Arts numériques',
  'Littérature'
];

const INTEREST_LEVELS = [
  { value: 'casual', label: translations.profile.interests.casual },
  { value: 'interested', label: translations.profile.interests.interested },
  { value: 'passionate', label: translations.profile.interests.passionate }
] as const;

export function InterestsSelector({ selectedInterests, onInterestsChange }: InterestsSelectorProps) {
  const handleInterestSelect = (e: React.MouseEvent, category: string) => {
    e.preventDefault(); // Empêcher la soumission du formulaire
    
    const existingInterest = selectedInterests.find(i => i.category === category);
    
    if (existingInterest) {
      // Cycle through levels or remove if at last level
      const currentLevelIndex = INTEREST_LEVELS.findIndex(l => l.value === existingInterest.level);
      if (currentLevelIndex === INTEREST_LEVELS.length - 1) {
        onInterestsChange(selectedInterests.filter(i => i.category !== category));
      } else {
        onInterestsChange(
          selectedInterests.map(i => 
            i.category === category 
              ? { ...i, level: INTEREST_LEVELS[currentLevelIndex + 1].value }
              : i
          )
        );
      }
    } else {
      // Add new interest with first level
      onInterestsChange([
        ...selectedInterests,
        { category, level: INTEREST_LEVELS[0].value }
      ]);
    }
  };

  const getInterestStyle = (category: string) => {
    const interest = selectedInterests.find(i => i.category === category);
    if (!interest) {
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }

    switch (interest.level) {
      case 'casual':
        return 'bg-blue-100 text-blue-800 ring-2 ring-blue-500';
      case 'interested':
        return 'bg-green-100 text-green-800 ring-2 ring-green-500';
      case 'passionate':
        return 'bg-purple-100 text-purple-800 ring-2 ring-purple-500';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getInterestLabel = (category: string) => {
    const interest = selectedInterests.find(i => i.category === category);
    if (!interest) return category;

    const level = INTEREST_LEVELS.find(l => l.value === interest.level);
    return `${category} • ${level?.label}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_INTERESTS.map(category => {
          const Icon = getInterestIcon(category);
          return (
            <button
              key={category}
              onClick={(e) => handleInterestSelect(e, category)}
              type="button"
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
                getInterestStyle(category)
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{getInterestLabel(category)}</span>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-500">
        Cliquez sur un centre d'intérêt pour définir votre niveau d'engagement. 
        Cliquez plusieurs fois pour changer de niveau ou retirer l'intérêt.
      </p>
    </div>
  );
}