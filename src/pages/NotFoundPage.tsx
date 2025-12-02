import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MapPin, ArrowRight } from 'lucide-react';
import { BaseLayout } from '../layouts/BaseLayout';
import { Logo } from '../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';

export function NotFoundPage() {
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRedirectMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showRedirectMessage && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    // Rediriger vers la homepage quand le compteur atteint 0
    if (countdown === 0) {
      navigate('/');
    }
  }, [showRedirectMessage, countdown, navigate]);

  return (
    <BaseLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-glass border-b border-white/20 shadow-glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Logo />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative">
                <MapPin className="w-24 h-24 mx-auto text-primary-500 animate-bounce" />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  404
                </span>
              </h1>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Page introuvable
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Il semble que vous vous soyez perdu... Pas de panique, laissez-nous vous guider vers la bonne destination !
              </p>
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 
                         to-secondary-500 text-white rounded-full font-medium shadow-button 
                         hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 
                         active:scale-95 active:shadow-button-pressed transition-all duration-300
                         group"
              >
                <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Retour à l'accueil</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <AnimatePresence>
                {showRedirectMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-sm text-gray-500"
                  >
                    Redirection automatique dans {countdown} secondes...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
