import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Header } from '../components/Header';
import { useEventContext } from '../contexts/event/EventContext';
import { Share2, Calendar, Clock, MapPin, User, ArrowLeft, Instagram, Twitter, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getCategoryIcon } from '../utils/categoryIcons';
import { openInMaps } from '../utils/mapUtils';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { ApplicationModal } from '../components/ApplicationModal';
import { useUserProfileCache } from '../hooks/useUserProfileCache';
import { useAuth } from '../contexts/AuthContext';
import { calculateAge } from '../utils/dateUtils';
import { shareEvent } from '../utils/shareUtils';
import { getSocialUrl } from '../utils/socialLinks';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, applyToEvent } = useEventContext();
  const { user } = useAuth();
  const { profile } = useUserProfileCache(user?.id);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

    window.scrollTo({ top: 0 });

  const event = events.find(e => e.id === eventId);
  const CategoryIcon = event ? getCategoryIcon(event.category) : null;
  const creatorProfile = event ? useUserProfileCache(event.createdBy.id) : null;
  const creatorAge = creatorProfile?.profile?.birthDate ? calculateAge(creatorProfile.profile.birthDate) : null;

  const handleShare = async () => {
    if (!event) return;

    try {
      const success = await shareEvent(event.title, window.location.href);
      setShareSuccess(success);
      
      if (success) {
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleApply = async (message: string, sharedSocialLinks: string[], tempContact?: string) => {
    if (!event || !applyToEvent || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await applyToEvent(event.id, message, sharedSocialLinks, tempContact);
      setShowApplicationModal(false);
    } catch (error) {
      console.error('Error applying to event:', error);
      alert('Une erreur est survenue lors de la candidature');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingScreen message="Chargement de l'événement..." />
        </div>
      </MainLayout>
    );
  }

  const hasApplied = event.applicants.some(app => app.user.id === user?.id);
  const userApplication = event.applicants.find(app => app.user.id === user?.id);
  const isOfferingHost = event.eventType === 'offering-host';
  const isOwnEvent = event.createdBy.id === user?.id;

  return (
    <div className="min-h-screen">
      <Header
        onSeekHost={() => navigate('/events/create/seeking-host')}
        onOfferHost={() => navigate('/events/create/offering-host')}
        onToggleDashboard={() => navigate('/dashboard')}
        onToggleProfile={() => navigate(`/profile/${user?.id}`)}
        onHome={() => navigate('/events')}
        showDashboard={false}
        showProfile={false}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-3xl mx-auto md:w-48 md:w-[calc(100%-6rem)]">
              <button
                onClick={() => navigate(-1)}
                className="absolute -left-14 top-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 
                 transition-colors group md:flex hidden"
              title="Retour"
      >
                <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
              </button>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div 
            className={clsx(
                      "relative h-16 md:h-auto md:py-6 flex items-center px-3",
                      isOfferingHost
                        ? "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white"
                        : "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                    )}>
            <div className="flex items-center justify-between w-full">

              <div className="md:hidden">
              <button
                 onClick={() => navigate(-1)}
                className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
              <div className="relative ml-auto">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full 
                           hover:bg-gray-50 transition-all duration-300 shadow-md"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Partager</span>
                </button>
                {shareSuccess && (
                  <div className="absolute top-full mt-2 right-0 bg-green-500 text-white px-3 py-1 
                                rounded-md text-sm whitespace-nowrap animate-fade-out">
                    Lien copié !
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Title and Category */}
            <div className="flex items-center gap-4 mb-6">
              {CategoryIcon && (
                <div className={clsx(
                  "p-3 rounded-full shadow-md",
                  isOfferingHost 
                    ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                    : "bg-gradient-to-r from-primary-500 to-primary-600"
                )}>
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            </div>

            {/* Creator Profile */}
            <div 
              onClick={() => navigate(`/profile/${event.createdBy.id}`)}
              className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 
                       transition-all duration-300 cursor-pointer"
            >
              {event.createdBy.avatar ? (
                <img
                  src={event.createdBy.avatar}
                  alt={event.createdBy.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
              ) : (
                <User 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md text-gray-500"
                />
              )}
              <div className="ml-3">
                <p className="text-base font-semibold text-gray-900">
                  {event.createdBy.name}
                  {creatorAge && <span className="text-gray-500 ml-2">{creatorAge} ans</span>}
                </p>
                {/* 
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">{event.createdBy.rating}</span>
                </div>*/}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 whitespace-pre-line">{event.description}</p>

            {/* Event Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-primary-500" />
                <span>{format(new Date(event.date), 'PPP', { locale: fr })}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3 text-primary-500" />
                <span>{event.time.slice(0, 5)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <button
                onClick={(e) => {
                  openInMaps(event.location);
                }}
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-3 text-primary-500" />
                <span className="font-semibold truncate">{event.location}</span>
              </button>
              </div>
            </div>

            

            {/* Application Status or Button */}
            {!isOwnEvent && (
              <div className="flex justify-center">
                {hasApplied ? (
                  <div className={clsx(
                    'flex items-center justify-center gap-2 px-6 py-3 rounded-full text-center font-medium',
                    userApplication?.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : userApplication?.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {userApplication?.status === 'pending' && (
                      <>
                        <Clock className="w-5 h-5" />
                        {isOfferingHost ? 'Demande envoyée' : 'Invitation envoyée'}
                      </>
                    )}
                    {userApplication?.status === 'accepted' && (
                      <>
                        <Calendar className="w-5 h-5" />
                        Candidature acceptée
                      </>
                    )}
                    {userApplication?.status === 'rejected' && (
                      <>
                        <Calendar className="w-5 h-5" />
                        Candidature refusée
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplicationModal(true)}
                    disabled={event.status !== 'open' || isSubmitting}
                    className={clsx(
                      "max-w-md py-3 px-24 rounded-full font-medium shadow-lg",
                      "flex items-center justify-center gap-2",
                      "transform transition-all duration-300 hover:scale-105",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                      isOfferingHost
                        ? "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700"
                        : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
                    )}
                  >
                    {isSubmitting ? (
                      'Envoi en cours...'
                    ) : isOfferingHost ? (
                      'Je me fais inviter !'
                    ) : (
                      'J\'invite !'
                    )}
                  </button>
                )}
              </div>
            )}

            {userApplication?.status === 'accepted' && event.createdBy.socialLinks && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mt-6 space-y-2"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contacts</h3>
    {event.createdBy.socialLinks.map((link, index) => {
      if (!link.url || !link.isPublic) return null;
      
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
        <motion.a
          key={`${link.platform}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          href={getSocialUrl(link.platform, link.url)}
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
          </div>
          
        </div>
          </div>
      </main>

      {showApplicationModal && profile && (
        <ApplicationModal
          onSubmit={handleApply}
          onClose={() => setShowApplicationModal(false)}
          isOffering={isOfferingHost}
          socialLinks={profile.socialLinks}
        />
      )}
    </div>
  );
}