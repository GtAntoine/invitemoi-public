import { useEffect, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Compass, Plus, Ticket } from 'lucide-react';
import clsx from 'clsx';
import { useBadges, useDemo } from '../lib/store';
import { Logo } from './Logo';
import { Avatar, ButtonLink } from './ui/primitives';

function Badge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={clsx(
        'grid h-[18px] min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[11px] font-bold leading-none text-white ring-2 ring-surface',
        className,
      )}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

function DesktopLink({ to, children, badge }: { to: string; children: ReactNode; badge?: number }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-[15px] font-medium transition-colors',
          isActive ? 'bg-ink text-bg' : 'text-ink hover:bg-sunken',
        )
      }
    >
      {children}
      {!!badge && <Badge count={badge} />}
    </NavLink>
  );
}

function TabLink({ to, label, icon, badge }: { to: string; label: string; icon: ReactNode; badge?: number }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx('relative flex flex-1 flex-col items-center gap-1 pt-2 text-[11px] font-semibold', isActive ? 'text-ink' : 'text-muted')
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative">
            {icon}
            {!!badge && <Badge count={badge} className="absolute -right-2.5 -top-1.5" />}
          </span>
          {label}
          {isActive && <motion.span layoutId="tab-dot" className="absolute top-0 h-[3px] w-6 rounded-full bg-coral" />}
        </>
      )}
    </NavLink>
  );
}

export function AppShell() {
  const { me, signIn } = useDemo();
  const badges = useBadges();
  const location = useLocation();

  // Les liens profonds vers l'app ouvrent directement la démo avec le profil de Camille.
  useEffect(() => {
    if (!me) signIn();
  }, [me, signIn]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  if (!me) return null;

  // Les parcours ciblés (création, tri des candidats) masquent la barre d'onglets.
  const focus = /^\/(creer|mes-sorties\/[^/]+)/.test(location.pathname);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
          <Logo to="/explorer" />
          <NavLink
            to="/reglages"
            className="ml-1 rounded-full border border-dashed border-line px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted hover:border-muted"
            title="Réglages de la démo"
          >
            Démo
          </NavLink>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            <DesktopLink to="/explorer">Explorer</DesktopLink>
            <DesktopLink to="/mes-sorties" badge={badges.total}>
              Mes sorties
            </DesktopLink>
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <ButtonLink to="/creer" size="sm" className="h-10 px-4">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Créer une annonce
            </ButtonLink>
            <NavLink
              to="/activite"
              aria-label="Activité"
              className={({ isActive }) =>
                clsx('relative grid h-10 w-10 place-items-center rounded-full', isActive ? 'bg-ink text-bg' : 'hover:bg-sunken')
              }
            >
              <Bell className="h-5 w-5" />
              <Badge count={badges.unreadActivity} className="absolute -right-0.5 -top-0.5" />
            </NavLink>
            <NavLink to={`/profil/${me.id}`} aria-label="Mon profil" className="rounded-full">
              <Avatar user={me} size={40} />
            </NavLink>
          </div>
        </div>
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={clsx('mx-auto max-w-6xl px-4 pt-5 md:px-6 md:pb-16 md:pt-8', focus ? 'pb-10' : 'pb-28')}
      >
        <Outlet />
      </motion.main>

      <nav className={clsx('fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-safe backdrop-blur-md md:hidden', focus && 'hidden')}>
        <div className="mx-auto flex max-w-md items-stretch">
          <TabLink to="/explorer" label="Explorer" icon={<Compass className="h-6 w-6" />} />
          <TabLink to="/mes-sorties" label="Mes sorties" icon={<Ticket className="h-6 w-6" />} badge={badges.total} />
          <div className="flex flex-1 justify-center">
            <NavLink
              to="/creer"
              aria-label="Créer une annonce"
              className="-mt-5 grid h-14 w-14 place-items-center rounded-full bg-coral text-white shadow-[0_10px_24px_-8px_rgb(var(--coral)/0.8)] ring-4 ring-bg active:scale-95"
            >
              <Plus className="h-7 w-7" strokeWidth={2.5} />
            </NavLink>
          </div>
          <TabLink to="/activite" label="Activité" icon={<Bell className="h-6 w-6" />} badge={badges.unreadActivity} />
          <TabLink to={`/profil/${me.id}`} label="Profil" icon={<Avatar user={me} size={24} />} />
        </div>
      </nav>
    </div>
  );
}
