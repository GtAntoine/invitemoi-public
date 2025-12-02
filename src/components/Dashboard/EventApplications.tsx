import React, { useState, useEffect, useRef } from 'react';
import { Event, ApplicationStatus } from '../../types/event';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, MapPin, ChevronDown, ChevronUp, Instagram, Twitter, Link as LinkIcon, Trash2, User, Check, X } from 'lucide-react';
import { translations } from '../../translations/fr';
import { calculateAge } from '../../utils/dateUtils';
import { extractSocialHandle } from '../../utils/socialLinks';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SwipeableApplication } from './SwipeableApplication';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryIcon } from '../../utils/categoryIcons';
import clsx from 'clsx';
import { useEventContext } from '../../contexts/event/EventContext';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant: 'accept' | 'reject';
  isConfirming?: boolean;
}

export function ActionButton({ onClick, children, variant, isConfirming }: ActionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
    const [width, setWidth] = useState<number | null>(null);


  const handleClick = () => {
    if (showConfirm) {
      onClick();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    if (!isConfirming) {
      setShowConfirm(false);
    }
  }, [isConfirming]);

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onBlur={() => setTimeout(() => {
        setShowConfirm(false);
      }, 200)}
      className={clsx(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300', // Largeur fixe
        'transform hover:scale-105 active:scale-95',
        variant === 'accept' ? (
          showConfirm 
            ? 'w-[110px] bg-green-600 text-white shadow-button active:shadow-button-pressed'
            : 'w-[100px] bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-button active:shadow-button-pressed'
        ) : (
          showConfirm
            ? 'w-[110px] bg-red-600 text-white shadow-button active:shadow-button-pressed'
            : 'w-[100px] bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-button active:shadow-button-pressed'
        )
      )}
    >
      <div className="relative h-5">
        <motion.div
          className="flex items-center justify-center gap-1.5 absolute w-full"
          initial={false}
          animate={{ 
            y: showConfirm ? -20 : 0,
            opacity: showConfirm ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
        <motion.div
          className="flex items-center justify-center gap-1.5 absolute w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: showConfirm ? 0 : 20,
            opacity: showConfirm ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {variant === 'accept' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          Confirmer
        </motion.div>
      </div>
    </motion.button>
  );
}


interface EventApplicationsProps {
  event: Event;
  onAcceptApplicant: (eventId: string, applicantId: string) => void;
  onRejectApplicant: (eventId: string, applicantId: string) => void;
  onViewProfile: (userId: string) => void;
  onDeleteEvent: () => void;
}

export function EventApplications({ 
  event, 
  onAcceptApplicant, 
  onRejectApplicant,
  onViewProfile,
  onDeleteEvent
}: EventApplicationsProps) {
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingActionFor, setConfirmingActionFor] = useState<string | null>(null);
  const { dashboard } = translations;
  const isMobile = window.innerWidth < 768;
  const CategoryIcon = getCategoryIcon(event.category);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [event.id]);

  const getStatusBadge = (status: ApplicationStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };

    return (
      <span className={clsx(baseClasses, statusClasses[status])}>
        {dashboard.applicants[status]}
      </span>
    );
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      default:
        return <LinkIcon className="w-4 h-4" />;
    }
  };

  const getSocialLabel = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'X (Twitter)';
      case 'instagram':
        return 'Instagram';
      default:
        return 'Autre';
    }
  };

  // Filtrer les candidatures rejetées
  const activeApplications = event.applicants.filter(app => app.status !== 'rejected');
  const visibleApplications = showAllApplications 
    ? activeApplications 
    : activeApplications.slice(0, 3);

  const remainingApplications = activeApplications.length - 3;
  const hasReachedMaxApplications = event.applicants.length >= 20;
  const hasAcceptedApplicant = event.applicants.some(app => app.status === 'accepted');

 const handleAccept = (applicantId: string) => {
    onAcceptApplicant(event.id, applicantId);
    setConfirmingActionFor(null);
  };

  const handleReject = (applicantId: string) => {
    onRejectApplicant(event.id, applicantId);
    setConfirmingActionFor(null);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-3"
    >
          <div className="flex items-center gap-2 mb-2">
       {hasReachedMaxApplications && (
            <div className="text-sm">
              <div className="text-red-600">
                Limite de candidatures atteinte. Supprimez des candidatures pour pouvoir en recevoir de nouvelles.
              </div>
            </div>
          )}

            {hasAcceptedApplicant && (
              <span className="min-w-fit	inline-block px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                {translations.events.alreadyMatched}
              </span>
            )}
          </div>

      
      <div className="flex justify-between items-start mb-3">
        
        <div className="truncate">
          <div className="flex items-center gap-2">
{CategoryIcon && (
  <div className="p-2 rounded-full shadow-sm flex-shrink-0 bg-gradient-to-r bg-gradient-to-r from-primary-500 to-primary-600">
    <CategoryIcon className="w-3 h-3 text-white" />
  </div>
)}
<h3 className="text-base truncate font-bold text-gray-900">{event.title}</h3>
</div>
          
      
        </div>
        <div className="flex items-center gap-2">
         
          <button
            onClick={onDeleteEvent}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Supprimer l'événement"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 mb-3 text-sm">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-1.5 text-primary-500" />
          <span>{format(new Date(event.date), 'PPP', { locale: fr })}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1.5 text-primary-500" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1.5 text-primary-500" />
          <span>{event.location}</span>
        </div>
      </div>

       <motion.div layout className="p-3 pb-0">
        {activeApplications.length > 0 ? (
          <div className="">
            <h4 className="font-medium text-gray-900 text-sm truncate">{dashboard.applicants.title}</h4>
            <motion.div 
              layout
              className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {visibleApplications.map((application) => {
                  const age = application.user.birthDate ? calculateAge(application.user.birthDate) : null;
                  const canShowActions = application.status === 'pending' && !hasAcceptedApplicant;
                  
                  return (
                    <motion.div
                      key={`${application.user.id}-${application.timestamp}`}
                      layout
                      initial={{ opacity: 1, height: "auto" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { duration: 0.2 }
                      }}
                      className=""
                    >
                      {isMobile && canShowActions ? (
                        <SwipeableApplication
                          application={application}
                          onAccept={() => onAcceptApplicant(event.id, application.user.id)}
                          onReject={() => onRejectApplicant(event.id, application.user.id)}
                          onViewProfile={() => onViewProfile(application.user.id)}
                        />
                      ) : (
                        <div key={`${application.user.id}-${application.timestamp}`} className="relative w-full bg-white rounded-lg shadow-md p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div 
                              className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                              onClick={() => onViewProfile(application.user.id)}
                            >
                              {application.user.avatar ? (
                               <img
                                 src={application.user.avatar}
                                 alt={application.user.name}
                                 className="w-8 h-8 rounded-full border-2 border-primary-100"
                               />
                              ) : (
                               <User 
                                 className="w-8 h-8 rounded-full border-2 border-primary-100 text-gray-500"
                               />
                              )}
                              <div className="ml-2">
                                <p className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors">
                                  {application.user.name}
                                  {age && <span className="text-gray-500 ml-2">{age} ans</span>}
                                </p>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(application.status)}
                                </div>
                              </div>
                            </div>
                                {canShowActions && (
                                  <div className="flex gap-1.5">
                                    <ActionButton
                                      onClick={() => handleReject(application.user.id)}
                                      variant="reject"
                                      isConfirming={confirmingActionFor === application.user.id}
                                    >
                                      Refuser
                                    </ActionButton>
                                    <ActionButton
                                      onClick={() => handleAccept(application.user.id)}
                                      variant="accept"
                                      isConfirming={confirmingActionFor === application.user.id}
                                    >
                                      Accepter
                                    </ActionButton>
                                  </div>
                                )}
                          </div>
                          <div className="mt-1.5 rounded-md">
                            <p className="text-sm text-gray-600">{application.message}</p>
                              {application.status === 'accepted' && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5,
      staggerChildren: 0.1 // Ajoute un délai entre chaque lien
    }}
    className="mt-3 space-y-2"
  >
    {application.sharedSocialLinks?.map((platform, index) => {
      const socialLink = application.user.socialLinks?.find(link => link.platform === platform);
      if (!socialLink?.url) return null;

    // If it's "other" platform, render as div instead of link
      if (platform === 'other') {
        return (
          <motion.div
            key={`${platform}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 text-sm text-gray-600
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
              {getSocialIcon(platform)}
            </motion.div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {getSocialLabel(platform)}
              </div>
              <div className="text-sm text-gray-500">
                {socialLink.url}
              </div>
            </div>
          </motion.div>
        );
      }

    
      return (
        <motion.a
          key={`${platform}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }} // Délai progressif pour chaque lien
          href={socialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 
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
            {getSocialIcon(platform)}
          </motion.div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {getSocialLabel(platform)}
            </div>
            <div className="text-sm text-gray-500">
              {extractSocialHandle(platform, socialLink.url)}
            </div>
          </div>
        </motion.a>
      );
    })}
    {application.tempContact && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (application.sharedSocialLinks?.length || 0) * 0.1 }}
        className="flex items-center gap-3 text-sm text-gray-600 bg-white p-3 
                  rounded-lg border border-gray-100 shadow-sm"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (application.sharedSocialLinks?.length || 0) * 0.1 + 0.2 }}
          className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 
                    rounded-full text-white shadow-md"
        >
          <Instagram className="w-4 h-4" />
        </motion.div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">
            Instagram (temporaire)
          </div>
          <div className="text-sm text-gray-500">
            {application.tempContact}
          </div>
        </div>
      </motion.div>
    )}
  </motion.div>
)}

                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(application.timestamp), 'PPp', { locale: fr })}
                    </p>
                  </div>
                </div>
            
                    )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

          {activeApplications.length > 3 && (
            <button
              onClick={() => setShowAllApplications(!showAllApplications)}
              className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 
                       bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-gray-700 text-sm"
            >
              {showAllApplications ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Voir {remainingApplications} candidatures de plus
                </>
              )}
            </button>
          )}
         </div>
        ) : (
          <p className="text-gray-500 text-center py-3 text-sm">{dashboard.applicants.empty}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default EventApplications;