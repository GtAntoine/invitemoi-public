import { useRef, useState } from 'react';
import { motion, useAnimationControls, useReducedMotion, type PanInfo } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { CATEGORIES, KINDS } from '../lib/catalog';
import { dayLabel, timeLabel } from '../lib/format';
import type { Outing, User } from '../lib/types';
import { Avatar } from './ui/primitives';

/** Numéro de série stable, dérivé de l'identifiant de l'annonce. */
export function serial(id: string) {
  let h = 7;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return String(h).padStart(4, '0');
}

const TEAR_DISTANCE = 64;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const tones = {
  // Le papier garde la même teinte en clair et en sombre, comme les affiches des catégories.
  offer: {
    paper: 'bg-[#D63F22] text-white',
    soft: 'text-white',
    rule: 'border-white/30',
    stubHover: 'hover:bg-[#C2381E]',
  },
  wish: {
    paper: 'bg-[#F6B634] text-[#2A1F00]',
    soft: 'text-[#3D2D00]',
    rule: 'border-[#2A1F00]/20',
    stubHover: 'hover:bg-[#EEAA22]',
  },
};

interface TicketProps {
  outing: Outing;
  owner: User;
  /** Appelé une fois le talon détaché. */
  onTear: () => void;
  className?: string;
}

/**
 * Billet à talon : la partie principale décrit la sortie, le talon porte l'action.
 * On détache le talon en le tirant le long de la perforation, ou d'un clic.
 */
export function Ticket({ outing, owner, onTear, className }: TicketProps) {
  const kind = KINDS[outing.kind];
  const tone = tones[outing.kind];
  const category = CATEGORIES[outing.category];
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const dragged = useRef(false);
  const [torn, setTorn] = useState(false);

  const tear = async (direction: { x: number; y: number } = { x: 1, y: 0.2 }) => {
    if (torn) return;
    setTorn(true);
    if (!reduce) {
      await controls.start({
        x: direction.x * 180,
        y: direction.y * 180 + 40,
        rotate: direction.x * 14,
        opacity: 0,
        transition: { duration: 0.5, ease: EASE_OUT },
      });
    }
    onTear();
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { x } = info.offset;
    if (Math.abs(x) > TEAR_DISTANCE) tear({ x: Math.sign(x), y: 0.2 });
  };

  const hostLine =
    outing.kind === 'offer' ? (
      <>
        Offert par <strong className="font-semibold">{owner.firstName}</strong>, {owner.age} ans
      </>
    ) : (
      <>
        <strong className="font-semibold">{owner.firstName}</strong>, {owner.age} ans, cherche qui l’invite
      </>
    );

  return (
    <article
      aria-label={`${kind.badge} : ${outing.title}`}
      className={clsx('relative flex flex-col drop-shadow-[0_18px_28px_rgb(var(--shadow)/0.22)] md:flex-row', className)}
    >
      <div className={clsx('ticket-main relative min-w-0 flex-1 rounded-t-[22px] p-5 sm:p-7 md:rounded-l-[22px] md:rounded-tr-none', tone.paper)}>
        <div className={clsx('flex items-center justify-between border-b pb-3 text-[11px] font-semibold uppercase tracking-[0.14em]', tone.rule)}>
          <span>{kind.badge}</span>
          <span className={clsx('tabular-nums', tone.soft)}>
            {category.label} · N° {serial(outing.id)}
          </span>
        </div>

        <h3 className="mt-4 text-[26px] font-bold leading-[1.08] text-balance sm:text-[32px] lg:text-[38px]">{outing.title}</h3>

        <div className={clsx('mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px]', tone.soft)}>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden />
            {dayLabel(outing.date)} · {timeLabel(outing.time)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden />
            {outing.venue}
          </span>
        </div>

        <p className="mt-5 flex items-center gap-2.5 text-[15px]">
          <Avatar user={owner} size={30} />
          <span>{hostLine}</span>
        </p>
      </div>

      <motion.button
        type="button"
        animate={controls}
        drag={!reduce && !torn ? 'x' : false}
        dragSnapToOrigin
        dragElastic={0.35}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={onDragEnd}
        onClick={() => {
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          tear();
        }}
        whileHover={reduce ? undefined : { rotate: -1.5, x: 4 }}
        className={clsx(
          'ticket-stub group relative flex cursor-grab touch-pan-y items-center justify-between gap-4 rounded-b-[22px] px-5 py-4 text-left transition-colors active:cursor-grabbing sm:px-7 md:w-44 md:flex-col md:items-start md:justify-center md:rounded-r-[22px] md:rounded-bl-none md:px-6 lg:w-52',
          tone.paper,
          tone.stubHover,
        )}
      >
        <span aria-hidden className="ticket-perf absolute inset-x-5 top-1 h-1.5 md:inset-x-auto md:inset-y-5 md:left-1 md:h-auto md:w-1.5" />
        <span className="font-display text-xl font-bold leading-tight sm:text-2xl">{kind.cta}</span>
        <span className="flex flex-col items-end gap-1 md:items-start">
          <span className={clsx('inline-flex items-center gap-1.5 text-[13px] font-medium', tone.soft)}>
            Détacher le talon
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
          <span className={clsx('text-[11px] font-semibold uppercase tracking-[0.14em] tabular-nums', tone.soft)}>
            Pour deux · N° {serial(outing.id)}
          </span>
        </span>
      </motion.button>
    </article>
  );
}
