import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import clsx from 'clsx';
import { relative } from '../lib/format';
import { useDemo } from '../lib/store';
import type { Activity } from '../lib/types';
import { Avatar, EmptyState } from '../components/ui/primitives';

export function ActivityPage() {
  const { state, user, outing, markActivityRead } = useDemo();
  const markRead = useRef(markActivityRead);
  markRead.current = markActivityRead;

  // Les notifications restent en surbrillance pendant la visite, puis passent en lu.
  useEffect(() => () => markRead.current(), []);

  const describe = (a: Activity) => {
    const o = a.outingId ? outing(a.outingId) : undefined;
    const who = a.userId ? user(a.userId) : undefined;
    if (!o || !who) return null;
    switch (a.type) {
      case 'new-application':
        return {
          text: o.kind === 'offer' ? (
            <>
              <b>{who.firstName}</b> veut venir à «&nbsp;{o.title}&nbsp;»
            </>
          ) : (
            <>
              <b>{who.firstName}</b> propose de t’inviter&nbsp;: «&nbsp;{o.title}&nbsp;»
            </>
          ),
          href: `/mes-sorties/${o.id}`,
        };
      case 'accepted':
        return {
          text: (
            <>
              C’est un match&nbsp;! <b>{who.firstName}</b> t’a choisi·e pour «&nbsp;{o.title}&nbsp;»
            </>
          ),
          href: `/sortie/${o.id}`,
        };
      case 'declined':
        return {
          text: (
            <>
              <b>{who.firstName}</b> a choisi quelqu’un d’autre pour «&nbsp;{o.title}&nbsp;»
            </>
          ),
          href: `/sortie/${o.id}`,
        };
      default:
        return null;
    }
  };

  const items = state.activity
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((a) => ({ a, d: describe(a) }))
    .filter((x) => x.d);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Activité</h1>
      {items.length === 0 ? (
        <EmptyState icon={<Bell className="h-6 w-6" />} title="Rien de neuf pour l’instant" body="Les réponses à tes annonces et à tes demandes apparaîtront ici." />
      ) : (
        <ul className="space-y-2">
          {items.map(({ a, d }) => (
            <li key={a.id}>
              <Link
                to={d!.href}
                className={clsx(
                  'flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-sunken',
                  !a.read && 'bg-coral-soft/60',
                )}
              >
                <Avatar user={user(a.userId!)} size={44} />
                <p className="min-w-0 flex-1 text-[15px] leading-snug">
                  {d!.text}
                  <span className="mt-0.5 block text-xs text-muted">{relative(a.createdAt)}</span>
                </p>
                {!a.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-coral" aria-label="Non lu" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
