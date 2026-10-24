import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import clsx from 'clsx';
import { AVATAR_TONES, KINDS } from '../../lib/catalog';
import type { OutingKind, User } from '../../lib/types';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ink';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-coral dark:bg-[#D63F22] text-white hover:brightness-110 active:brightness-95 shadow-[0_6px_16px_-6px_rgb(var(--coral)/0.6)]',
  ink: 'bg-ink text-bg hover:opacity-90',
  secondary: 'bg-surface text-ink border border-line hover:bg-sunken',
  ghost: 'text-ink hover:bg-sunken',
  danger: 'bg-danger-soft text-danger hover:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-14 px-7 text-base gap-2.5',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return clsx(
    'inline-flex select-none items-center justify-center rounded-full font-semibold transition-[transform,filter,background-color,opacity] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, ...props },
  ref,
) {
  return <button ref={ref} className={buttonClass(variant, size, className)} {...props} />;
});

export function ButtonLink({ variant, size, className, ...props }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function Avatar({ user, size = 40, ring = false }: { user: User; size?: number; ring?: boolean }) {
  return (
    <span
      className={clsx(
        'inline-grid shrink-0 place-items-center rounded-full font-display font-semibold text-[#FBF4EA]',
        ring && 'ring-[3px] ring-surface',
      )}
      style={{ width: size, height: size, background: AVATAR_TONES[user.tone % AVATAR_TONES.length], fontSize: size * 0.42 }}
      aria-hidden
    >
      {user.firstName.charAt(0)}
    </span>
  );
}

export function Verified({ className }: { className?: string }) {
  return <BadgeCheck className={clsx('h-4 w-4 text-coral', className)} aria-label="Profil vérifié" />;
}

export function KindBadge({ kind, className }: { kind: OutingKind; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        kind === 'offer' ? 'bg-coral text-white' : 'bg-saffron text-[#3A2A00]',
        className,
      )}
    >
      {KINDS[kind].badge}
    </span>
  );
}

export function Chip({
  active,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={clsx(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors',
        active ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-ink hover:bg-sunken',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Tag({ children, highlight }: { children: ReactNode; highlight?: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-sm',
        highlight ? 'bg-coral-soft font-semibold text-coral-ink' : 'bg-sunken text-ink',
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <h2 className="text-xl font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-12 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-sunken text-muted">{icon}</span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
