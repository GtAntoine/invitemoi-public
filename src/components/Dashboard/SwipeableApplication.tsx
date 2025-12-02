import React, { useRef, useState, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, X, User } from 'lucide-react';
import { Application } from '../../types/event';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calculateAge } from '../../utils/dateUtils';
import clsx from 'clsx';
import { ActionButton } from './EventApplications';
import { useEventContext } from '../../contexts/event/EventContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SwipeableApplicationProps {
  application: Application;
  onAccept: () => void;
  onReject: () => void;
  onViewProfile: () => void;
}

export function SwipeableApplication({ 
  application, 
  onAccept, 
  onReject,
  onViewProfile
}: SwipeableApplicationProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [willTrigger, setWillTrigger] = useState<'accept' | 'reject' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const { darkMode } = useTheme();
  const background = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    darkMode ? [
      'rgba(239, 68, 68, 0.3)', // Dark mode red (reject)
      'rgba(239, 68, 68, 0.2)',
      'rgba(31, 41, 55, 1)',    // Dark mode background
      'rgba(34, 197, 94, 0.2)', 
      'rgba(34, 197, 94, 0.3)'  // Dark mode green (accept)
    ] : [
      'rgba(239, 68, 68, 0.2)', // Light mode red (reject)
      'rgba(239, 68, 68, 0.1)',
      'rgba(255, 255, 255, 1)', // Light mode background
      'rgba(34, 197, 94, 0.1)',
      'rgba(34, 197, 94, 0.2)'  // Light mode green (accept)
    ]
  );

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      x.set(0);
      setWillTrigger(null);
      setIsDragging(false);
    };
  }, []);

  const bind = useDrag(({ down, movement: [mx], direction: [dx], velocity: [vx], first, last }) => {
    if (first) {
      setIsDragging(true);
    }

    if (isDragging) {
      x.set(mx);

      if (Math.abs(mx) > 75) {
        setWillTrigger(mx > 0 ? 'accept' : 'reject');
      } else {
        setWillTrigger(null);
      }

      if (!down) {
        const trigger = Math.abs(mx) > 100;
        if (trigger) {
          if (mx > 0) {
            onAccept();
          } else {
            onReject();
          }
        } else {
          x.set(0);
        }
        setWillTrigger(null);
        setIsDragging(false);
      }
    }
  }, {
    axis: 'x',
    bounds: { left: -200, right: 200 },
    rubberband: true,
    filterTaps: true
  });

  const age = application.user.birthDate ? calculateAge(application.user.birthDate) : null;

  const [showConfirm, setShowConfirm] = useState(false);

  const handleAcceptClick = () => {
  if (showConfirm) {
    onAccept();
    setShowConfirm(false);
  } else {
    setShowConfirm(true);
  }
};

const handleRejectClick = () => {
  if (showConfirm) {
    onReject();
    setShowConfirm(false);
  } else {
    setShowConfirm(true);
  }
};

  useEffect(() => {
  if (!isDragging) {
    setShowConfirm(false);
  }
}, [isDragging]);
  
  return (
    <motion.div
      ref={cardRef}
      {...bind()}
      style={{ 
        x,
        scale,
        rotate,
        opacity,
        background,
        touchAction: 'pan-y'
      }}
      className="relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-grab active:cursor-grabbing"
    >
      {/* Indicateurs de swipe */}
      <motion.div 
         onBlur={() => setTimeout(() => {
          setShowConfirm(false);
        }, 200)}
        style={{ opacity: useTransform(x, [-200, -75], [1, 0]) }}
        className={clsx(
          'absolute inset-0 flex items-start justify-center pt-4 pointer-events-none transition-colors duration-200',
          willTrigger === 'reject' ? 'bg-red-50/50 dark:bg-red-900/50' : ''
        )}
      >
        <div className={clsx(
          'p-2 rounded-full transition-colors duration-200',
          willTrigger === 'reject' ? 'bg-red-500' : 'bg-red-100 dark:bg-red-800'
        )}>
          <X className={clsx(
            'w-6 h-6 transition-colors duration-200',
            willTrigger === 'reject' ? 'text-white' : 'text-red-600 dark:text-red-400'
          )} />
        </div>
      </motion.div>
      
      <motion.div 
        style={{ opacity: useTransform(x, [75, 200], [0, 1]) }}
        className={clsx(
          'absolute inset-0 flex items-start justify-center pt-4 pointer-events-none transition-colors duration-200',
          willTrigger === 'accept' ? 'bg-green-50/50 dark:bg-green-900/50' : ''
        )}
      >
        <div className={clsx(
          'p-2 rounded-full transition-colors duration-200',
          willTrigger === 'accept' ? 'bg-green-500' : 'bg-green-100 dark:bg-green-800'
        )}>
          <Check className={clsx(
            'w-6 h-6 transition-colors duration-200',
            willTrigger === 'accept' ? 'text-white' : 'text-green-600 dark:text-green-400'
          )} />
        </div>
      </motion.div>

      {/* Contenu de la carte */}
      <div className="relative z-10">
        <div 
          className="flex items-center gap-3 mb-3 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile();
          }}
        >
          {application.user.avatar ? (
            <img
              src={application.user.avatar}
              alt={application.user.name}
              className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-md"
            />
          ) : (
            <User 
              className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-md text-gray-500"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {application.user.name}
              {age && <span className="text-gray-500 ml-2 dark:text-gray-400">{age} ans</span>}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{format(new Date(application.timestamp), 'PPp', { locale: fr })}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">{application.message}</p>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-2 mt-4">
        <ActionButton
          onClick={onReject}
          variant="reject"
          isConfirming={showConfirm}
        >
          Refuser
        </ActionButton>
        <ActionButton
          onClick={onAccept}
          variant="accept"
          isConfirming={showConfirm}
        >
          Accepter
        </ActionButton>
      </div>
    </motion.div>
  );
}