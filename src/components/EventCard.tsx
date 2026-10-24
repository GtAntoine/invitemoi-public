import { Link } from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';
import clsx from 'clsx';
import { CATEGORIES, KINDS } from '../lib/catalog';
import { stamp, timeLabel, plural } from '../lib/format';
import { useDemo } from '../lib/store';
import type { Outing } from '../lib/types';
import { Avatar, KindBadge, Verified } from './ui/primitives';
import { StatusPill } from './StatusPill';

export function EventCover({ outing, className, large }: { outing: Outing; className?: string; large?: boolean }) {
  const { icon: Icon, poster, label } = CATEGORIES[outing.category];
  const s = stamp(outing.date);
  return (
    <div className={clsx('relative isolate overflow-hidden text-[#FBF4EA]', className)} style={{ background: poster }}>
      <Icon
        className={clsx('absolute -z-10 opacity-[0.16]', large ? '-bottom-16 -right-10 h-80 w-80' : '-bottom-10 -right-6 h-44 w-44')}
        strokeWidth={1.25}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-40 mix-blend-soft-light"
        style={{ background: 'radial-gradient(120% 90% at 0% 0%, #fff 0%, transparent 55%)' }}
      />
      <div className={clsx('flex h-full flex-col justify-between', large ? 'p-6' : 'p-4')}>
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-xl bg-[#FBF4EA] px-2.5 py-1.5 text-center leading-none text-[#1A1714] shadow-sm">
            <div className="text-[10px] font-bold tracking-wider text-[#6B635A]">{s.weekday}</div>
            <div className="font-display text-xl font-bold">{s.day}</div>
          </div>
          <KindBadge kind={outing.kind} className="ring-2 ring-[#FBF4EA]/90" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-90">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
      </div>
    </div>
  );
}

export function EventCard({ outing, className }: { outing: Outing; className?: string }) {
  const { user, applicationsFor, myApplicationTo, me } = useDemo();
  const owner = user(outing.ownerId);
  const apps = applicationsFor(outing.id);
  const mine = myApplicationTo(outing.id);
  const isOwn = outing.ownerId === me?.id;
  const matched = apps.some((a) => a.status === 'accepted');

  return (
    <Link
      to={`/sortie/${outing.id}`}
      className={clsx(
        'group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-transform duration-200 hover:-translate-y-0.5',
        className,
      )}
    >
      <EventCover outing={outing} className="h-36" />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold leading-snug text-balance">{outing.title}</h3>
        <div className="mt-1.5 flex items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {timeLabel(outing.time)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{outing.venue}</span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar user={owner} size={30} />
            <p className="min-w-0 truncate text-sm">
              <span className="font-semibold">{isOwn ? 'Toi' : owner.firstName}</span>
              {!isOwn && <span className="text-muted">, {owner.age} ans</span>}
              <span className="text-muted"> · {isOwn ? (outing.kind === 'offer' ? 'tu invites' : 'tu cherches un hôte') : KINDS[outing.kind].ownerVerb}</span>
            </p>
            {owner.verified && !isOwn && <Verified className="shrink-0" />}
          </div>
          {mine ? (
            <StatusPill status={mine.status} kind={outing.kind} />
          ) : matched ? (
            <span className="shrink-0 rounded-full bg-sunken px-2.5 py-1 text-xs font-semibold text-muted">Complet</span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted">
              <Users className="h-3.5 w-3.5" />
              {apps.length > 0 ? plural(apps.length, 'intéressé·e', 'intéressé·es') : 'Réponds en premier'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
