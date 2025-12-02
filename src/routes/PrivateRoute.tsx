import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { CreateProfileForm } from '../components/auth/CreateProfileForm';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { exists, loading: profileLoading } = useUserProfile(user?.id || '');

  if (authLoading || profileLoading) {
    return <LoadingScreen message="Vérification de l'authentification..." />;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (!exists) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-secondary-50 py-12 px-4">
        <CreateProfileForm onComplete={() => window.location.reload()} />
      </div>
    );
  }

  return <>{children}</>;
}