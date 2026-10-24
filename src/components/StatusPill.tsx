import { Check, Hourglass, X } from 'lucide-react';
import clsx from 'clsx';
import type { ApplicationStatus, OutingKind } from '../lib/types';

export function statusLabel(status: ApplicationStatus, kind: OutingKind) {
  if (status === 'accepted') return "C'est un match";
  if (status === 'declined') return 'Pas retenu·e';
  return kind === 'offer' ? 'Demande envoyée' : 'Proposition envoyée';
}

export function StatusPill({ status, kind, className }: { status: ApplicationStatus; kind: OutingKind; className?: string }) {
  const Icon = status === 'accepted' ? Check : status === 'declined' ? X : Hourglass;
  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        status === 'accepted' && 'bg-success-soft text-success',
        status === 'pending' && 'bg-saffron-soft text-saffron-ink',
        status === 'declined' && 'bg-sunken text-muted',
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {statusLabel(status, kind)}
    </span>
  );
}
