import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { dayLabel, timeLabel } from '../lib/format';
import type { Outing, User } from '../lib/types';
import { Avatar, Button } from './ui/primitives';

interface MatchOverlayProps {
  open: boolean;
  me: User;
  other: User;
  outing: Outing;
  showContact: boolean;
  onClose: () => void;
  onUndo: () => void;
}

export function MatchOverlay({ open, me, other, outing, showContact, onClose, onUndo }: MatchOverlayProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-coral p-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="C'est un match"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(60% 50% at 50% 30%, rgb(var(--saffron)) 0%, transparent 70%)' }}
          />
          <div className="relative flex w-full max-w-sm flex-col items-center text-center">
            <div className="mb-8 flex items-center">
              <motion.div initial={{ x: -60, rotate: -12, opacity: 0 }} animate={{ x: 10, rotate: -8, opacity: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.1 }}>
                <div className="rounded-full ring-4 ring-white">
                  <Avatar user={me} size={104} />
                </div>
              </motion.div>
              <motion.div initial={{ x: 60, rotate: 12, opacity: 0 }} animate={{ x: -10, rotate: 8, opacity: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.18 }}>
                <div className="rounded-full ring-4 ring-white">
                  <Avatar user={other} size={104} />
                </div>
              </motion.div>
            </div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl font-bold"
            >
              C’est un match&nbsp;!
            </motion.h2>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }} className="mt-3 text-lg text-white/90">
              Toi et {other.firstName}, {dayLabel(outing.date).toLowerCase()} à {timeLabel(outing.time)}, {outing.venue}.
            </motion.p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.46 }} className="mt-8 w-full space-y-3">
              {showContact && other.instagram ? (
                <a
                  href={`https://instagram.com/${other.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white font-semibold text-[#1A1714]"
                >
                  <Instagram className="h-5 w-5" />
                  Écrire à @{other.instagram}
                </a>
              ) : (
                <p className="rounded-2xl bg-white/15 p-4 text-sm">
                  {other.firstName} n’a pas partagé de réseau. Ton contact lui est envoyé pour qu’il ou elle t’écrive.
                </p>
              )}
              <Button variant="ink" size="lg" className="w-full !bg-[#1A1714] !text-white" onClick={onClose}>
                Super, terminé
              </Button>
              <button onClick={onUndo} className="text-sm font-semibold text-white/80 underline-offset-4 hover:underline">
                Annuler ce choix
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
