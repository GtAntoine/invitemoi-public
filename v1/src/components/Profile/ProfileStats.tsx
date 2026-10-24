import React from 'react';
import { Activity, Users, ThumbsUp } from 'lucide-react';
import { UserStats } from '../../types/user';
import { translations } from '../../translations/fr';

interface ProfileStatsProps {
  stats: UserStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const { profile: t } = translations;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Activity className="w-4 h-4" />
          <span>{t.stats.eventsCreated}</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.eventsCreated}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Users className="w-4 h-4" />
          <span>{t.stats.eventsAttended}</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</p>
      </div>
      {/* 
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <ThumbsUp className="w-4 h-4" />
          <span>{t.stats.rating}</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
      </div>
      */}
    </div>
  );
}