import React from 'react';
import { UserInterest } from '../../types/user';
import { translations } from '../../translations/fr';
import { getInterestIcon } from '../../utils/interestIcons';
import clsx from 'clsx';

interface ProfileInterestsProps {
  interests: UserInterest[];
}

export function ProfileInterests({ interests }: ProfileInterestsProps) {
  const { profile: t } = translations;

  const getInterestLevel = (level: string) => {
    const levels = {
      casual: { color: 'bg-blue-100 text-blue-800', label: t.interests.casual },
      interested: { color: 'bg-green-100 text-green-800', label: t.interests.interested },
      passionate: { color: 'bg-purple-100 text-purple-800', label: t.interests.passionate }
    };
    return levels[level as keyof typeof levels];
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{t.interests.title}</h2>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => {
          const level = getInterestLevel(interest.level);
          const Icon = getInterestIcon(interest.category);
          return (
            <span
              key={index}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                level.color
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{interest.category} • {level.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}