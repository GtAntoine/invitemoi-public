import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Inbox, Instagram, RotateCcw, Share2 } from 'lucide-react';
import { dayLabel, timeLabel } from '../lib/format';
import { useDemo } from '../lib/store';
import type { Application, ApplicationStatus } from '../lib/types';
import { SwipeDeck } from '../components/SwipeDeck';
import { MatchOverlay } from '../components/MatchOverlay';
import { Avatar, Button, EmptyState, KindBadge } from '../components/ui/primitives';
import { useToast } from '../components/ui/Toast';
import { NotFoundPage } from './NotFound';

export function ManageOutingPage() {
  const { id = '' } = useParams();
  const { outing: find, applicationsFor, user, me, setStatuses, markOwnerSeen } = useDemo();
  const toast = useToast();
  const [matchOf, setMatchOf] = useState<{ app: Application; snapshot: Record<string, ApplicationStatus> } | null>(null);

  const outing = find(id);
  const apps = applicationsFor(id);
  const unseen = apps.some((a) => !a.seenByOwner);

  // Ouvrir la page vaut lecture des nouvelles candidatures.
  useEffect(() => {
    if (unseen) markOwnerSeen(id);
  }, [id, unseen, markOwnerSeen]);

  if (!outing || !me || outing.ownerId !== me.id) return <NotFoundPage embedded />;

  const pending = apps.filter((a) => a.status === 'pending').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const accepted = apps.find((a) => a.status === 'accepted');
  const declined = apps.filter((a) => a.status === 'declined');

  const snapshotOf = () => Object.fromEntries(apps.map((a) => [a.id, a.status])) as Record<string, ApplicationStatus>;

  const decide = (app: Application, decision: 'accepted' | 'declined') => {
    const snapshot = snapshotOf();
    if (decision === 'accepted') {
      // Une sortie se vit à deux : choisir quelqu'un clôt les autres candidatures.
      const statuses: Record<string, ApplicationStatus> = { [app.id]: 'accepted' };
      for (const other of pending) if (other.id !== app.id) statuses[other.id] = 'declined';
      setStatuses(statuses);
      setMatchOf({ app, snapshot });
    } else {
      setStatuses({ [app.id]: 'declined' });
      toast.show({
        title: `Candidature de ${user(app.userId).firstName} passée`,
        tone: 'neutral',
        actionLabel: 'Annuler',
        onAction: () => setStatuses({ [app.id]: snapshot[app.id] }),
      });
    }
  };

  const undoMatch = () => {
    if (matchOf) setStatuses(matchOf.snapshot);
    setMatchOf(null);
  };

  const shareLink = async () => {
    const url = `${window.location.origin}/sortie/${outing.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.show({ title: 'Lien copié', body: 'Partage ton annonce pour recevoir plus de réponses.', tone: 'success' });
    } catch {
      // ignoré
    }
  };

  const role = outing.kind === 'offer' ? 'invité·e' : 'hôte';

  return (
    <div>
      <Link to="/mes-sorties" className="-ml-2 mb-4 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-sunken">
        <ArrowLeft className="h-4 w-4" />
        Mes sorties
      </Link>

      <div className="mb-6 md:mb-8 md:text-center">
        <KindBadge kind={outing.kind} className="!px-2 !py-0.5 !text-[10px]" />
        <h1 className="mt-2 text-xl font-bold text-balance md:text-3xl">{outing.title}</h1>
        <p className="mt-1 text-sm text-muted md:text-base">
          {dayLabel(outing.date)} à {timeLabel(outing.time)} · {outing.venue}
        </p>
      </div>

      {accepted ? (
        <div className="mx-auto max-w-md rounded-[28px] bg-success-soft p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-success">Ton {role}</p>
          <div className="mt-4 flex justify-center">
            <Avatar user={user(accepted.userId)} size={88} />
          </div>
          <p className="mt-3 font-display text-2xl font-bold">
            {user(accepted.userId).firstName}, {user(accepted.userId).age} ans
          </p>
          <p className="mt-2 text-sm italic text-muted">« {accepted.message} »</p>
          {accepted.shareInstagram && user(accepted.userId).instagram && (
            <a
              href={`https://instagram.com/${user(accepted.userId).instagram}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-surface px-5 font-semibold"
            >
              <Instagram className="h-5 w-5" />@{user(accepted.userId).instagram}
            </a>
          )}
        </div>
      ) : pending.length > 0 ? (
        <>
          <SwipeDeck candidates={pending} onDecide={decide} />
          <p className="mx-auto mt-4 max-w-xs text-center text-xs text-muted">
            Choisis ton {role}. Les autres seront prévenu·es avec délicatesse.
          </p>
        </>
      ) : (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title={declined.length > 0 ? 'Tu as vu toutes les candidatures' : 'Pas encore de réponse'}
          body={
            declined.length > 0
              ? 'Reconsidère une candidature passée ci-dessous, ou partage ton annonce pour en recevoir d’autres.'
              : 'Les premières réponses arrivent souvent dans l’heure. Partager ton annonce aide à aller plus vite.'
          }
          action={
            <Button variant="secondary" onClick={shareLink}>
              <Share2 className="h-4 w-4" />
              Copier le lien de l’annonce
            </Button>
          }
        />
      )}

      {declined.length > 0 && (
        <div className="mx-auto mt-12 max-w-md">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">Candidatures passées</h2>
          <ul className="divide-y divide-line rounded-3xl border border-line bg-surface">
            {declined.map((a) => (
              <li key={a.id} className="flex items-center gap-3 p-3">
                <Avatar user={user(a.userId)} size={36} />
                <p className="min-w-0 flex-1 truncate text-sm">
                  <span className="font-semibold">{user(a.userId).firstName}</span>
                  <span className="text-muted"> · {a.message}</span>
                </p>
                {!accepted && (
                  <button
                    onClick={() => setStatuses({ [a.id]: 'pending' })}
                    className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-semibold hover:bg-sunken"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reconsidérer
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {matchOf && (
        <MatchOverlay
          open
          me={me}
          other={user(matchOf.app.userId)}
          outing={outing}
          showContact={matchOf.app.shareInstagram}
          onClose={() => setMatchOf(null)}
          onUndo={undoMatch}
        />
      )}
    </div>
  );
}
