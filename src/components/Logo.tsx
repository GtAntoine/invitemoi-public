import { Link } from 'react-router-dom';
import clsx from 'clsx';

/** Marque d'origine (deux tickets et un cœur), recoloriée safran vers corail. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/logo-mark.png"
      width={size}
      height={size}
      alt=""
      className="shrink-0 rounded-[28%]"
      style={{ width: size, height: size }}
    />
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
