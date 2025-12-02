// src/components/Dashboard/UserApplications.tsx
import React from 'react';
import { Event, Application } from '../../types/event';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, MapPin, User, Trash2, Instagram, Twitter, Phone } from 'lucide-react';
import { translations } from '../../translations/fr';
import { calculateAge } from '../../utils/dateUtils';
import { getSocialUrl, extractSocialHandle } from '../../utils/socialLinks';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface UserApplicationsProps {
  event: Event;
  application: Application;
  onViewProfile: (userId: string) => void;
  onDeleteApplication: () => void;
}

export function UserApplications({ 
  event,
  application,
  onViewProfile,
  onDeleteApplication
}: UserApplicationsProps) {
    const creatorAge = event.createdBy.birthDate ? calculateAge(event.createdBy.birthDate) : null;
  const firstName = event.createdBy.name;
  const canDelete = application.status === 'pending';

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'X (Twitter)';
      case 'instagram':
        return 'Instagram';
      default:
        return 'Contact';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3">
      <div className="flex justify-between items-start mb-4">
        <div className="">
          <h3 className="text-lg line-clamp-2	font-semibold text-gray-900">{event.title}</h3>
          <span className="inline-block px-2 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full mt-2">
            {translations.forms.categories[event.category]}
          </span>
        </div>
        <div className="flex items-center gap-3 min-w-fit">
          <span className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium',
            getStatusColor(application.status)
          )}>
            {translations.dashboard.applicants[application.status]}
          </span>
          {canDelete && (
            <button
              onClick={onDeleteApplication}
              className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Supprimer la candidature"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div 
        className="flex items-center gap-3 mb-3 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        onClick={() => onViewProfile(event.createdBy.id)}
      >
        {event.createdBy.avatar ? (
         <img
           src={event.createdBy.avatar}
           alt={event.createdBy.name}
           className="w-10 h-10 rounded-full"
         />
        ) : (
         <User 
           className="w-10 h-10 rounded-full text-gray-500"
         />
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {firstName}
            {creatorAge && <span className="text-gray-500 ml-2">{creatorAge} ans</span>}
          </p>
        </div>
      </div>

      {application.status === 'accepted' && event.createdBy.socialLinks && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          {event.createdBy.socialLinks.map((link, index) => {
            if (!link.url || !link.isPublic) return null;
            
            return (
              <motion.a
                key={`${link.platform}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                href={getSocialUrl(link.platform, link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mb-3 text-sm text-gray-600 hover:text-gray-900 
                         bg-white p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 
                         border border-gray-100 hover:border-gray-200 shadow-sm"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 
                            rounded-full text-white shadow-md"
                >
                  {getPlatformIcon(link.platform)}
                </motion.div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {getPlatformLabel(link.platform)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {link.url}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(new Date(event.date), 'PPP', { locale: fr })}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-md p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <User className="w-4 h-4" />
          <span className="font-medium">Votre message :</span>
        </div>
        <p className="text-gray-600 line-clamp-10">{application.message}</p>
        <p className="text-xs text-gray-500 mt-2">
          Envoyé le {format(new Date(application.timestamp), 'PPp', { locale: fr })}
        </p>
      </div>

      
    </div>
  );
}
