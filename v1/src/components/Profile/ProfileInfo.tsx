import React from 'react';
import { MapPin, Calendar, Star, Cake } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { translations } from '../../translations/fr';
import { UserProfile } from '../../types/user';
import { calculateAge } from '../../utils/dateUtils';

interface ProfileInfoProps {
  profile: UserProfile;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  const { profile: t } = translations;
  const age = calculateAge(profile.birthDate);

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Cake className="w-4 h-4" />
            <span>{age} ans</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              Depuis {format(new Date(profile.joinedDate), 'MM/yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}