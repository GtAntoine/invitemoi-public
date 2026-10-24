import { Link } from 'react-router-dom';
import clsx from 'clsx';

/** Marque : deux tickets qui se chevauchent, l'un donné, l'autre reçu. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect x="3" y="7" width="18" height="18" rx="5" fill="rgb(var(--saffron))" transform="rotate(-10 12 16)" />
      <rect x="11" y="7" width="18" height="18" rx="5" fill="rgb(var(--coral))" transform="rotate(8 20 16)" />
      <circle cx="20" cy="16" r="2.6" fill="#FBF4EA" />
    </svg>
  );
}

export function Logo({ to = '/', className }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={clsx('inline-flex items-center gap-2', className)} aria-label="Invite Moi, accueil">
      <LogoMark />
      <span className="font-display text-[22px] font-bold leading-none tracking-tight">
        invite<span className="text-coral">moi</span>
      </span>
    </Link>
  );
}
