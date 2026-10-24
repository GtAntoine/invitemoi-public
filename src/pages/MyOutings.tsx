import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Megaphone, Send, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { dayLabel, plural, timeLabel } from '../lib/format';
import { useBadges, useDemo } from '../lib/store';
import type { Outing } from '../lib/types';
import { EventCover } from '../components/EventCard';
import { StatusPill } from '../components/StatusPill';
import { Avatar, ButtonLink, EmptyState, KindBadge } from '../components/ui/primitives';

type Tab = 'annonces' | 'demandes';

function UpcomingMatches() {
  const { state, user, me } = useDemo();
  if (!me) return null;

  const matches = state.applications
    .filter((a) => a.status === 'accepted')
    .map((a) => ({ app: a, outing: state.outings.find((o) => o.id === a.outingId)! }))
    .filter(({ app, outing }) => outing && (outing.ownerId === me.id || app.userId === me.id))
    .sort((a, b) => (a.outing.date + a.outing.time).localeCompare(b.outing.date + b.outing.time));

  if (matches.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
        <Sparkles className="h-5 w-5 text-coral" />
        Tes prochaines sorties
      </h2>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-2 md:px-0">
        {matches.map(({ app, outing }) => {
          const other = user(outing.ownerId === me.id ? app.userId : outing.ownerId);
          return (
            <Link
              key={app.id}
              to={outing.ownerId === me.id ? `/mes-sorties/${outing.id}` : `/sortie/${outing.id}`}
              className={clsx(
                'flex shrink-0 snap-start items-center gap-4 rounded-3xl bg-ink p-4 text-bg md:w-auto',
                matches.length > 1 ? 'w-[85%]' : 'w-full',
              )}
            >
              <div className="flex -space-x-3">
                <Avatar user={me} size={44} />
                <Avatar user={other} size={44} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-semibold leading-snug">{outing.title}</p>
                <p className="mt-0.5 truncate text-sm opacity-70">
                  Avec {other.firstName} · {dayLabel(outing.date)} {timeLabel(outing.time)}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 opacity-60" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function MyListingRow({ outing }: { outing: Outing }) {
  const { applicationsFor, user } = useDemo();
  const apps = applicationsFor(outing.id);
  const pending = apps.filter((a) => a.status === 'pending');
  const fresh = pending.filter((a) => !a.seenByOwner).length;
  const accepted = apps.find((a) => a.status === 'accepted');

  return (
    <Link
      to={`/mes-sorties/${outing.id}`}
      className="flex min-w-0 items-center gap-4 rounded-3xl border border-line bg-surface p-3 shadow-card transition-colors hover:bg-sunken/50"
    >
      <EventCover outing={outing} className="hidden h-24 w-24 shrink-0 rounded-2xl sm:block [&_.font-display]:text-base" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-1 pl-1 sm:pl-0">
        <div className="flex items-center gap-2">
          <KindBadge kind={outing.kind} className="!px-2 !py-0.5 !text-[10px]" />
          <span className="truncate text-xs text-muted">
            {dayLabel(outing.date)} · {timeLabel(outing.time)}
          </span>
        </div>
        <p className="truncate font-semibold">{outing.title}</p>
        {accepted ? (
          <p className="flex items-center gap-1.5 text-sm font-medium text-success">
            <Avatar user={user(accepted.userId)} size={20} />
            Avec {user(accepted.userId).firstName}
          </p>
        ) : pending.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {pending.slice(0, 4).map((a) => (
                <Avatar key={a.id} user={user(a.userId)} size={22} ring />
              ))}
            </div>
            <span className="truncate text-sm text-muted">{plural(pending.length, 'candidat·e', 'candidat·es')}</span>
            {fresh > 0 && (
              <span className="shrink-0 rounded-full bg-coral px-2 py-0.5 text-[11px] font-bold text-white">
                {fresh} nouveau{fresh > 1 ? 'x' : ''}
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted">En attente de réponses</p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </Link>
  );
}

function MyRequestRow({ outingId, status }: { outingId: string; status: Parameters<typeof StatusPill>[0]['status'] }) {
  const { outing: find, user, myApplicationTo } = useDemo();
  const outing = find(outingId);
  const mine = myApplicationTo(outingId);
  if (!outing || !mine) return null;
  const owner = user(outing.ownerId);
  return (
    <Link
      to={`/sortie/${outing.id}`}
      className={clsx(
        'flex min-w-0 items-center gap-4 rounded-3xl border bg-surface p-4 shadow-card transition-colors hover:bg-sunken/50',
        !mine.seenByApplicant ? 'border-success' : 'border-line',
      )}
    >
      <Avatar user={owner} size={48} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{outing.title}</p>
        <p className="truncate text-sm text-muted">
          {outing.kind === 'offer' ? `${owner.firstName} invite` : `Tu invites ${owner.firstName}`} · {dayLabel(outing.date)}
        </p>
        <StatusPill status={status} kind={outing.kind} className="mt-2" />
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </Link>
  );
}

export function MyOutingsPage() {
  const { state, me, markApplicantSeen } = useDemo();
  const badges = useBadges();
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('onglet') === 'demandes' ? 'demandes' : 'annonces';

  // Les réponses deviennent « lues » quand on quitte l'onglet Demandes, pour garder la surbrillance pendant la lecture.
  const markSeen = useRef(markApplicantSeen);
  markSeen.current = markApplicantSeen;
  useEffect(() => {
    if (tab !== 'demandes') return;
    return () => markSeen.current();
  }, [tab]);

  if (!me) return null;

  const listings = state.outings.filter((o) => o.ownerId === me.id).sort((a, b) => a.date.localeCompare(b.date));
  const requests = state.applications
    .filter((a) => a.userId === me.id)
    .sort((a, b) => Number(a.seenByApplicant) - Number(b.seenByApplicant) || b.createdAt.localeCompare(a.createdAt));

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'annonces', label: 'Mes annonces', count: badges.incoming },
    { id: 'demandes', label: 'Mes demandes', count: badges.answers },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Mes sorties</h1>
      <UpcomingMatches />

      <div role="tablist" className="mb-5 flex gap-6 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setParams(t.id === 'annonces' ? {} : { onglet: t.id }, { replace: true })}
            className={clsx('relative flex items-center gap-2 pb-3 text-[15px] font-semibold', tab === t.id ? 'text-ink' : 'text-muted')}
          >
            {t.label}
            {t.count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1.5 text-[11px] font-bold text-white">{t.count}</span>}
            {tab === t.id && <motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-ink" />}
          </button>
        ))}
      </div>

      {tab === 'annonces' ? (
        listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {listings.map((o) => (
              <MyListingRow key={o.id} outing={o} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Megaphone className="h-6 w-6" />}
            title="Aucune annonce en cours"
            body="Propose d’inviter quelqu’un, ou lance une envie de sortie et laisse les hôtes venir à toi."
            action={<ButtonLink to="/creer">Créer une annonce</ButtonLink>}
          />
        )
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {requests.map((a) => (
            <MyRequestRow key={a.id} outingId={a.outingId} status={a.status} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Send className="h-6 w-6" />}
          title="Pas encore de demande"
          body="Trouve une sortie qui te plaît et réponds à l’annonce. Les réponses arrivent ici."
          action={<ButtonLink to="/explorer">Explorer les sorties</ButtonLink>}
        />
      )}
    </div>
  );
}
