import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight, HandHeart } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { BaseLayout } from '../layouts/BaseLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { LatestEvents } from '../components/LatestEvents';

export function LandingPage() {
  return (
    <BaseLayout>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-glass border-b border-white/20 shadow-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <Link
              to="/auth/login"
              className="glass-button"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Flemme de dépenser ?
            </span>
            <br/>
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Fais toi inviter !
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Invitez ou faites-vous inviter à des événements culturels et créez des connexions authentiques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register"
              className="glass-button from-secondary-500/80 to-secondary-600/80 inline-flex items-center gap-2"
            >
              <HandHeart className="w-5 h-5" />
              Je me fais inviter
            </Link>
            <Link
              to="/auth/register"
              className="glass-button from-primary-500/80 to-primary-600/80 inline-flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              J'invite !
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Events Section */}
      <LatestEvents />

      {/* Features Section */}
      <section className="relative pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-700">
              Découvrez comment partager des moments uniques en toute simplicité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="text-center p-8 hover:scale-105 transition-all duration-500">
              <div className="flex justify-center mb-8">
                <img 
                  src="/images/create.svg" 
                  alt="Créez votre profil" 
                  className="w-40 h-40"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Créez votre profil
              </h3>
              <p className="text-gray-700">
               Transformez vos sorties en opportunités gratuites. Votre profil est votre passeport pour des expériences uniques et des rencontres extraordinaires.
              </p>
            </GlassCard>

            <GlassCard className="text-center p-8 hover:scale-105 transition-all duration-500">
              <div className="flex justify-center mb-8">
                <img 
                  src="/images/candidate.svg" 
                  alt="Proposez ou rejoignez" 
                  className="w-40 h-40"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Proposez ou rejoignez
              </h3>
              <p className="text-gray-700">
               Deux options : invitez qui vous voulez ou faites-vous inviter par qui vous voulez. Restaurant, théâtre, concert… tout est possible.
              </p>
            </GlassCard>

            <GlassCard className="text-center p-8 hover:scale-105 transition-all duration-500">
              <div className="flex justify-center mb-8">
                <img 
                  src="/images/meet.svg" 
                  alt="Rencontrez et partagez" 
                  className="w-40 h-40"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Invitez ou faites-vous inviter
              </h3>
              <p className="text-gray-700">
                Prenez le contrôle de vos sorties. Que vous soyez l'hôte qui invite ou l'invité qui profite, votre charme et vos centres d'intérêt sont votre meilleur atout pour des rencontres et des moments uniques.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="relative pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                         bg-clip-text text-transparent mb-6">
              Prêt à vivre des moments uniques ?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté et commencez à partager des expériences culturelles enrichissantes.
            </p>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 
                       to-secondary-500 text-white rounded-full font-medium shadow-lg 
                       hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 
                       transition-all duration-300 text-lg"
            >
              Commencer l'aventure
              <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
      </section>
      
      {/* Footer with glass effect */}
      <Footer />
    </BaseLayout>
  );
}
