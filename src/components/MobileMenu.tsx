import React from 'react';
import { User, HandHeart, LayoutDashboard, Gift, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface MobileMenuProps {
  isOpen: boolean;
  profile: any;
  showDashboard: boolean;
  newNotifications?: number;
  onClose: () => void;
  onSeekHost: () => void;
  onOfferHost: () => void;
  onToggleDashboard: () => void;
  onToggleProfile: () => void;
  onSettings: () => void;
}

export function MobileMenu({
  isOpen,
  profile,
  showDashboard,
  newNotifications = 0,
  onClose,
  onSeekHost,
  onOfferHost,
  onToggleDashboard,
  onToggleProfile,
  onSettings
}: MobileMenuProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: User,
      label: 'Profil',
      onClick: () => {
        onClose();
        setTimeout(() => onToggleProfile(), 100);
      },
      position: 'translate(-150px, 0px)',
      gradient: 'from-primary-500 to-secondary-500'
    },
    {
      icon: LayoutDashboard,
      label: 'Tableau de bord',
      onClick: () => {
        onClose();
        setTimeout(() => onToggleDashboard(), 100);
      },
      position: 'translate(-145px, 62px)',
      gradient: 'from-primary-500 to-secondary-500',
      notifications: newNotifications
    },
    {
      icon:  Gift,
      label: 'J\'invite',
      onClick: () => {
        onClose();
        setTimeout(() => onOfferHost(), 100);
      },
      position: 'translate(-117px, 117px)',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      icon: HandHeart,
      label: 'Je me fais inviter',
      onClick: () => {
        onClose();
        setTimeout(() => onSeekHost(), 100);
      },
      position: 'translate(-62px, 145px)',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Settings,
      label: 'Paramètres',
      onClick: () => {
        onClose();
        setTimeout(() => onSettings(), 100);
      },
      position: 'translate(0, 150px)',
      gradient: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className={clsx(
      'fixed inset-0 md:hidden z-50',
      isOpen ? 'pointer-events-auto' : 'pointer-events-none'
    )}>
      {/* Overlay */}
      <div 
        className={clsx(
          'absolute inset-0 bg-black transition-opacity duration-300',
          isOpen ? 'opacity-50' : 'opacity-0'
        )}
      />

      {/* Menu circulaire */}
      <div className={clsx(
        'absolute top-2 right-4',
        'transition-transform duration-200',
        !isOpen && 'scale-0 opacity-0'
      )}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
            className={clsx(
              'absolute w-14 h-14 rounded-full flex items-center justify-center',
              'bg-gradient-to-r shadow-lg text-white',
              'transition-all duration-200 hover:scale-110',
              item.gradient
            )}
            style={{
              transform: isOpen ? item.position : 'translate(0, 0)',
              opacity: isOpen ? 1 : 0,
              transitionDelay: `${index * 50}ms`,
              zIndex: 60
            }}
          >
            <item.icon className="w-6 h-6" />
            {typeof item.notifications === 'number' && item.notifications > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 
                          flex items-center justify-center bg-red-500 text-white 
                          text-xs font-bold rounded-full">
              {item.notifications}
            </div>
          )}
          </button>
        ))}

        {/* Bouton central */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={clsx(
            'w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500',
            'flex items-center justify-center text-white shadow-lg',
            'transform transition-transform duration-300',
            isOpen
          )}
          style={{ zIndex: 60 }}
        >
           <X 
                  className="w-5 h-5 text-white rounded-full flex items-center justify-center"
                 /> 
        </button>
      </div>
    </div>
  );
}