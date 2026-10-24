import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { LandingPage } from './pages/Landing';
import { WelcomePage } from './pages/Welcome';
import { ExplorePage } from './pages/Explore';
import { OutingDetailPage } from './pages/OutingDetail';
import { CreatePage } from './pages/Create';
import { MyOutingsPage } from './pages/MyOutings';
import { ManageOutingPage } from './pages/ManageOuting';
import { ActivityPage } from './pages/Activity';
import { ProfilePage } from './pages/Profile';
import { SettingsPage } from './pages/Settings';
import { NotFoundPage } from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/bienvenue" element={<WelcomePage />} />
      <Route element={<AppShell />}>
        <Route path="/explorer" element={<ExplorePage />} />
        <Route path="/sortie/:id" element={<OutingDetailPage />} />
        <Route path="/creer" element={<CreatePage />} />
        <Route path="/mes-sorties" element={<MyOutingsPage />} />
        <Route path="/mes-sorties/:id" element={<ManageOutingPage />} />
        <Route path="/activite" element={<ActivityPage />} />
        <Route path="/profil/:id" element={<ProfilePage />} />
        <Route path="/reglages" element={<SettingsPage />} />
      </Route>
      {/* Anciennes adresses de la V1 */}
      <Route path="/events" element={<Navigate to="/explorer" replace />} />
      <Route path="/dashboard" element={<Navigate to="/mes-sorties" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
