import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { UserProfile } from '../components/Profile/UserProfile';
import { useAuth } from '../contexts/AuthContext';

export function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header
        onSeekHost={() => navigate('/events/create/seeking-host')}
        onOfferHost={() => navigate('/events/create/offering-host')}
        onToggleDashboard={() => navigate('/dashboard')}
        onToggleProfile={() => navigate(`/profile/${user?.id}`)}
        onHome={() => navigate('/events')}
        showDashboard={false}
        showProfile={userId === user?.id}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserProfile
          userId={userId}
          onBack={() => navigate(-1)}
        />
      </main>
    </div>
  );
}