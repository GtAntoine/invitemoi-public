import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BaseLayout } from './BaseLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  showDashboard?: boolean;
  showProfile?: boolean;
}

export function MainLayout({ children, showDashboard = false, showProfile = false }: MainLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <BaseLayout>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white/10 backdrop-blur-glass border-b border-white/20 shadow-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header
              onSeekHost={() => navigate('/events/create/seeking-host')}
              onOfferHost={() => navigate('/events/create/offering-host')}
              onToggleDashboard={() => navigate('/dashboard')}
              onToggleProfile={() => navigate(`/profile/${user?.id}`)}
              onHome={() => navigate('/events')}
              showDashboard={showDashboard}
              showProfile={showProfile}
            />
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </BaseLayout>
  );
}