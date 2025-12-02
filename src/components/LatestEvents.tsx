import React from 'react';
import { motion } from 'framer-motion';
import { mockLatestEvents } from '../data/mockLatestEvents';
import { EventCard } from './EventCard';
import { useNavigate } from 'react-router-dom';

export function LatestEvents() {
  const { seeking, offering } = mockLatestEvents;
  const navigate = useNavigate();

  const handleApply = () => {
    navigate('/auth/register');
  };

  const handleViewProfile = () => {
    navigate('/auth/register');
  };

  return (
    <section className="relative pb-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Événements à venir
          </h2>
          <p className="text-xl text-gray-700">
            Découvrez les dernières opportunités de rencontres culturelles des 7 prochains jours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
      
            <EventCard
              event={seeking}
              onApply={handleApply}
              onViewProfile={handleViewProfile}
            />
         
            <EventCard
              event={offering}
              onApply={handleApply}
              onViewProfile={handleViewProfile}
            />
        </div>
      </div>
    </section>
  );
}
