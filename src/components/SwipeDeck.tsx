import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Check, Languages, Star, X } from 'lucide-react';
import { relative } from '../lib/format';
import { useDemo } from '../lib/store';
import type { Application, User } from '../lib/types';
import { Avatar, Tag, Verified } from './ui/primitives';

const HINT_KEY = 'invitemoi-swipe-hint';
const THRESHOLD = 110;

type Decision = 'accepted' | 'declined';

function CandidateCard({ application, candidate, me }: { application: Application; candidate: User; me: User }) {
  const shared = candidate.interests.filter((i) => me.interests.includes(i));
  const others = candidate.interests.filter((i) => !me.interests.includes(i));
  return (
    <div className="flex h-full flex-col p-5 md:p-6">
      <div className="flex items-center gap-4">
        <Avatar user={candidate} size={72} />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-display text-2xl font-bold">
            {candidate.firstName}, {candidate.age} {candidate.verified && <Verified className="h-5 w-5" />}
          </p>
          <p className="flex items-center gap-1 text-sm text-muted">
            <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
            {candidate.rating.toFixed(1)} · {candidate.hosted + candidate.attended} sorties · {relative(application.createdAt).replace('il y a ', '')}
          </p>
        </div>
      </div>

      <blockquote className="mt-5 line-clamp-6 font-display text-[18px] leading-snug text-balance md:text-[19px]">« {application.message} »</blockquote>

      <div className="mt-auto space-y-3 pt-5">
        <div className="flex flex-wrap gap-1.5">
          {shared.map((i) => (
            <Tag key={i} highlight>
              {i}
            </Tag>
          ))}
          {others.slice(0, 3).map((i) => (
            <Tag key={i}>{i}</Tag>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Languages className="h-4 w-4" />
            {candidate.languages.join(', ')}
          </span>
          <Link
            to={`/profil/${candidate.id}`}
            onPointerDownCapture={(e) => e.stopPropagation()}
            className="font-semibold text-ink underline-offset-4 hover:underline"
          >
            Profil complet
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SwipeDeck({ candidates, onDecide }: { candidates: Application[]; onDecide: (app: Application, decision: Decision) => void }) {
  const { user, me } = useDemo();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-14, 0, 14]);
  const acceptOpacity = useTransform(x, [30, THRESHOLD], [0, 1]);
  const declineOpacity = useTransform(x, [-THRESHOLD, -30], [1, 0]);
  const busy = useRef(false);
  const top = candidates[0];

  const decide = async (decision: Decision) => {
    if (!top || busy.current) return;
    busy.current = true;
    await animate(x, decision === 'accepted' ? 640 : -640, { duration: 0.28, ease: 'easeIn' });
    onDecide(top, decision);
    x.set(0);
    busy.current = false;
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > THRESHOLD || info.velocity.x > 700) decide('accepted');
    else if (info.offset.x < -THRESHOLD || info.velocity.x < -700) decide('declined');
    else animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, [role="dialog"]')) return;
      if (e.key === 'ArrowRight') decide('accepted');
      if (e.key === 'ArrowLeft') decide('declined');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Un léger balancement, une seule fois, suggère que la carte se fait glisser.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === '1';
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      // ignoré
    }
    if (seen) return;
    const t = window.setTimeout(() => {
      animate(x, [0, -36, 28, 0], { duration: 1.1, ease: 'easeInOut' });
    }, 900);
    return () => window.clearTimeout(t);
  }, [x]);

  if (!top || !me) return null;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative h-[min(440px,52dvh)] min-h-[360px]">
        {candidates.slice(1, 3).map((app, i) => (
          <div
            key={app.id}
            className="absolute inset-0 rounded-[28px] border border-line bg-surface shadow-card"
            style={{ transform: `translateY(${(i + 1) * 12}px) scale(${1 - (i + 1) * 0.04})`, zIndex: 2 - i, opacity: 1 - (i + 1) * 0.25 }}
            aria-hidden
          />
        ))}
        <motion.div
          key={top.id}
          drag="x"
          dragSnapToOrigin={false}
          onDragEnd={onDragEnd}
          style={{ x, rotate, zIndex: 10, touchAction: 'pan-y' }}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 cursor-grab overflow-hidden rounded-[28px] border border-line bg-surface shadow-lift active:cursor-grabbing"
          aria-label={`Candidature de ${user(top.userId).firstName}`}
        >
          <motion.span
            style={{ opacity: acceptOpacity }}
            className="pointer-events-none absolute right-5 top-5 z-10 rotate-6 rounded-xl border-[3px] border-success px-3 py-1 font-display text-xl font-bold uppercase text-success"
          >
            Choisir
          </motion.span>
          <motion.span
            style={{ opacity: declineOpacity }}
            className="pointer-events-none absolute left-5 top-5 z-10 -rotate-6 rounded-xl border-[3px] border-muted px-3 py-1 font-display text-xl font-bold uppercase text-muted"
          >
            Passer
          </motion.span>
          <CandidateCard application={top} candidate={user(top.userId)} me={me} />
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          onClick={() => decide('declined')}
          aria-label="Passer"
          className="group grid h-16 w-16 place-items-center rounded-full border border-line bg-surface shadow-card transition-transform active:scale-90"
        >
          <X className="h-7 w-7 text-muted group-hover:text-ink" strokeWidth={2.5} />
        </button>
        <p className="w-24 text-center text-xs text-muted">
          {candidates.length} restant{candidates.length > 1 ? 's' : ''}
          <span className="mt-1 hidden gap-1 md:flex md:justify-center">
            <kbd className="rounded border border-line px-1.5">←</kbd>
            <kbd className="rounded border border-line px-1.5">→</kbd>
          </span>
        </p>
        <button
          onClick={() => decide('accepted')}
          aria-label="Choisir"
          className="grid h-16 w-16 place-items-center rounded-full bg-success text-white shadow-card transition-transform active:scale-90"
        >
          <Check className="h-7 w-7" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
