import React from 'react';
import { Calendar, Clock, MapPin, HandHeart, Gift, Check, Clock3, User } from 'lucide-react';
import { Event } from '../types/event';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calculateAge } from '../utils/dateUtils';
import { translations } from '../translations/fr';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryIcon } from '../utils/categoryIcons';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { openInMaps } from '../utils/mapUtils';

interface EventCardProps {
  event: Event;
  onApply: (eventId: string) => void;
  onViewProfile?: (userId: string) => void;
  currentUserId?: string;
}

export function EventCard({ 
  event, 
  onApply, 
  onViewProfile,
  currentUserId = '1' 
}: EventCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isOfferingHost = event.eventType === 'offering-host';
  const creatorAge = event.createdBy.birthDate ? calculateAge(event.createdBy.birthDate) : null;
  const firstName = event.createdBy.name;
  const isOwnEvent = event.createdBy.id === user?.id;

  const hasApplied = event.applicants.some(app => app.user.id === currentUserId);
  const userApplication = event.applicants.find(app => app.user.id === currentUserId);

  const CategoryIcon = getCategoryIcon(event.category);

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    onApply(event.id);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewProfile) {
      onViewProfile(event.createdBy.id);
    }
  };

  const getApplicationStatus = () => {
    if (!userApplication) return null;

    const statusConfig = {
      pending: {
        message: isOfferingHost ? 'Demande envoyée' : 'Invitation envoyée',
        icon: Clock3,
        className: 'bg-yellow-100 text-yellow-800'
      },
      accepted: {
        message: 'Candidature acceptée',
        icon: Check,
        className: 'bg-green-100 text-green-800'
      },
      rejected: {
        message: 'Candidature refusée',
        icon: Check,
        className: 'bg-red-100 text-red-800'
      }
    };

    return statusConfig[userApplication.status];
  };

  const applicationStatus = getApplicationStatus();

  return (
    <Link 
      to={`/events/${event.id}`}
      className={clsx(
        "block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300",
        "transform hover:-translate-y-1",
        isOfferingHost 
          ? "border-l-4 border-l-secondary-500" 
          : "border-l-4 border-l-primary-500"
      )}
    >
      <div className="p-3">
        {/* Title and Category */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {CategoryIcon && (
              <div className={clsx(
                "p-2 rounded-full shadow-sm flex-shrink-0",
                isOfferingHost 
                  ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                  : "bg-gradient-to-r from-primary-500 to-primary-600"
              )}>
                <CategoryIcon className="w-4 h-4 text-white" />
              </div>
            )}
            <h3 className="text-sm font-bold text-gray-900">{event.title}</h3>
          </div>
          
          {/* Creator Profile */}
          <div 
            onClick={handleProfileClick}
            className="flex items-center bg-gray-50 rounded-full hover:bg-gray-100 pr-3
                     transition-all duration-300 cursor-pointer"
          >
            {event.createdBy.avatar ? (
              <img
                src={event.createdBy.avatar}
                alt={event.createdBy.name}
                className="w-8 h-8 min-w-8 min-h-8 object-cover rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <User 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm text-gray-500"
              />
            )}
            <div className="ml-2 max-w-24 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {firstName}
                {creatorAge && <span className="text-gray-500 ml-2">{creatorAge} ans</span>}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-3 line-clamp-6 text-sm">{event.description}</p>

        {/* Event Details */}
        <div className="flex gap-3 justify-between">
          <div className="space-y-1 text-xs w-full">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-primary-500" />
                <span>{format(new Date(event.date), 'PPP', { locale: fr })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-primary-500" />
                <span>{event.time.slice(0, 5)}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
               <button
                  onClick={(e) => {
                    e.preventDefault(); // Empêcher la navigation vers la page de l'événement
                    e.stopPropagation(); // Empêcher la propagation du clic
                    openInMaps(event.location);
                  }}
                  className="flex items-center w-full text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <MapPin className="w-3 h-3 mr-1 text-primary-500" />
                  <span className="font-semibold truncate">{event.location}</span>
                </button>
            </div>
          </div>
          
        </div>
        {/* Application Status or Button */}
          {!isOwnEvent && (
            hasApplied ? (
              <div className={clsx(
                'flex self-end items-center mt-3 h-fit justify-center gap-1 py-1.5 px-3 rounded-full text-center text-sm font-medium',
                applicationStatus?.className
              )}>
                {applicationStatus?.icon && <applicationStatus.icon className="w-3 h-3" />}
                <span>{applicationStatus?.message}</span>
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={event.status !== 'open'}
                className={clsx(
                  "w-auto ml-auto mt-3 py-2 px-4 h-fit	rounded-full text-sm font-medium shadow-sm",
                  "flex self-end	items-center justify-center gap-1",
                  "transform transition-all duration-300 hover:scale-105",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                  isOfferingHost
                    ? "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700"
                    : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
                )}
              >
                {isOfferingHost ? (
                  <>
                    <HandHeart className="w-4 h-4" />
                    {translations.events.applyAsGuest}
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    {translations.events.offerToHost}
                  </>
                )}
              </button>
            )
          )}
      </div>
    </Link>
  );
}