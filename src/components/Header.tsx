import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Menu, X, Settings, User } from 'lucide-react';
import { translations } from '../translations/fr';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useEventContext } from '../contexts/event/EventContext';
import { useDashboardNotifications } from '../hooks/useDashboardNotifications';
import { NotificationBadge } from './NotificationBadge';
import { MobileMenu } from './MobileMenu';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface HeaderProps {
  onSeekHost: () => void;
  onOfferHost: () => void;
  onToggleDashboard: () => void;
  onToggleProfile: () => void;
  onHome: () => void;
  showDashboard: boolean;
  showProfile: boolean;
}

export function Header({ 
  onSeekHost, 
  onOfferHost, 
  onToggleDashboard, 
  onToggleProfile,
  onHome, 
  showDashboard,
  showProfile
}: HeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { header } = translations;
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id || '');
  const { events } = useEventContext();
  const { newApplications, newAcceptances, clearNotifications } = useDashboardNotifications(events);
  const isModalOpen = isMenuOpen;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleDashboardClick = () => {
    clearNotifications();
    onToggleDashboard();
  };

  return (
    <header className="z-50 sticky top-0 shadow-lg">
      {/* Fond avec transition */}
      <div 
        className={clsx(
          "absolute inset-0 transition-all duration-300",
          !isModalOpen && "bg-white/10 backdrop-blur-lg border-b border-white/20",
          isModalOpen && "bg-white"
        )}
        style={{
          WebkitBackdropFilter: isModalOpen ? 'none' : 'blur(16px)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Contenu du header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4">
        <div className="flex justify-between items-center">
          <Logo onClick={onHome} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleProfile}
                className="flex items-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  {profile?.avatar ? (
                    <img
                      src={profile?.avatar}
                      alt={profile?.name || 'Profile'}
                      className={clsx(
                        'w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-300 object-cover',
                        showProfile 
                          ? 'border-primary-500 ring-4 ring-primary-100' 
                          : 'border-transparent hover:border-primary-300'
                      )}
                    />
                  ) : (
                    <User 
                      className={clsx(
                        'w-10 h-10 bg-white shadow-lg rounded-full border-2 transition-all duration-300',
                        showProfile 
                          ? 'border-primary-500 ring-4 ring-primary-100 text-gray-500' 
                          : 'border-transparent hover:border-primary-300 text-gray-400'
                      )}
                    />
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full 
                                border-2 border-white"></div>
                </div>
              </button>
              <button
                onClick={handleDashboardClick}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg',
                  'relative',
                  showDashboard 
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                {header.dashboard}
                {(newApplications > 0 || newAcceptances > 0) && (
                  <NotificationBadge 
                    count={newApplications + newAcceptances} 
                    className="bg-red-500"
                  />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSeekHost}
                className="flex items-center gap-2 bg-gradient-to-r from-secondary-500 to-secondary-600 
                         text-white px-6 py-2.5 rounded-full font-medium shadow-lg 
                         hover:from-secondary-600 hover:to-secondary-700 transform hover:scale-105 
                         transition-all duration-300"
              >
                {header.seekHost}
              </button>
              <button
                onClick={onOfferHost}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 
                         text-white px-6 py-2.5 rounded-full font-medium shadow-lg 
                         hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 
                         transition-all duration-300"
              >
                {header.offerHost}
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-2 py-2 rounded-full font-medium 
                         bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-lg transition-all duration-300"
                title="Paramètres"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex justify-center items-center w-14 h-14 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 bg-gradient-to-r shadow-lg text-white hover:scale-110 from-primary-500 to-secondary-500"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu
                  className="w-5 h-5 text-white rounded-full flex items-center justify-center"
                 /> 
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={clsx(
            'fixed inset-0 bg-black bg-opacity-50 md:hidden transition-opacity duration-300',
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          profile={profile}
          showDashboard={showDashboard}
          newNotifications={newApplications + newAcceptances}
          onClose={() => setIsMenuOpen(false)}
          onSeekHost={onSeekHost}
          onOfferHost={onOfferHost}
          onToggleDashboard={onToggleDashboard}
          onToggleProfile={onToggleProfile}
          onSettings={() => navigate('/settings')}
        />
      </div>
    </header>
  );
}