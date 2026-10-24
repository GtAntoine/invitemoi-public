import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Instagram } from 'lucide-react';
import { useDemo } from '../lib/store';
import type { Outing } from '../lib/types';
import { Sheet } from './ui/Sheet';
import { Avatar, Button, ButtonLink } from './ui/primitives';

const MIN_LENGTH = 20;

const STARTERS = {
  offer: ['J’adore cet endroit', 'Je suis ponctuel·le', 'Partant·e pour un verre après', 'On a des goûts en commun'],
  wish: ['Je connais bien le lieu', 'Avec plaisir, c’est moi qui invite', 'On peut se retrouver sur place', 'On a des goûts en commun'],
};

export function ApplySheet({ outing, open, onClose }: { outing: Outing; open: boolean; onClose: () => void }) {
  const { user, me, apply } = useDemo();
  const owner = user(outing.ownerId);
  const [message, setMessage] = useState('');
  const [share, setShare] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setSent(false);
      setMessage('');
    }
  }, [open]);

  const title = outing.kind === 'offer' ? `Demander à ${owner.firstName} de venir` : `Proposer à ${owner.firstName} de l’inviter`;
  const tooShort = message.trim().length < MIN_LENGTH;

  const addStarter = (s: string) => setMessage((m) => (m.trim() ? `${m.trim()} ${s}.` : `${s}.`));

  return (
    <Sheet open={open} onClose={onClose} title={sent ? undefined : title}>
      {sent ? (
        <div className="flex flex-col items-center py-6 text-center">
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 260 }}
            className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-success-soft text-success"
          >
            <Check className="h-10 w-10" strokeWidth={2.5} />
          </motion.span>
          <h2 className="text-2xl font-bold">C’est envoyé&nbsp;!</h2>
          <p className="mt-2 max-w-xs text-muted">
            {owner.firstName} va lire ton message. Tu seras prévenu·e dès qu’il ou elle aura choisi.
          </p>
          <p className="mt-4 rounded-2xl bg-sunken px-4 py-2 text-xs text-muted">
            Dans la démo, la réponse arrive en une dizaine de secondes.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="secondary" onClick={onClose}>
              Continuer à explorer
            </Button>
            <ButtonLink to="/mes-sorties?onglet=demandes" onClick={onClose}>
              Voir mes demandes
            </ButtonLink>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tooShort) return;
            apply(outing.id, message.trim(), share && !!me?.instagram);
            setSent(true);
          }}
        >
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-sunken p-3">
            <Avatar user={owner} size={40} />
            <p className="text-sm">
              <span className="font-semibold">{outing.title}</span>
              <br />
              <span className="text-muted">
                Ton message est la première chose que {owner.firstName} verra. Dis pourquoi cette sortie, et pourquoi avec toi.
              </span>
            </p>
          </div>

          <label htmlFor="apply-message" className="sr-only">
            Ton message
          </label>
          <textarea
            id="apply-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={400}
            placeholder={outing.kind === 'offer' ? 'Salut ! Ce qui me donne envie de venir…' : 'Salut ! Je serais ravi·e de t’inviter parce que…'}
            className="w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed placeholder:text-muted focus:border-ink focus:outline-none"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{tooShort ? `Encore ${MIN_LENGTH - message.trim().length} caractères minimum` : 'Parfait.'}</span>
            <span>{message.length}/400</span>
          </div>

          <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
            {STARTERS[outing.kind].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => addStarter(s)}
                className="h-8 shrink-0 rounded-full border border-dashed border-line px-3 text-sm text-muted hover:border-ink hover:text-ink"
              >
                + {s}
              </button>
            ))}
          </div>

          {me?.instagram && (
            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-line p-3">
              <Instagram className="h-5 w-5 shrink-0 text-muted" />
              <span className="flex-1 text-sm">
                <span className="font-semibold">Partager mon Instagram si c’est un match</span>
                <br />
                <span className="text-muted">@{me.instagram}, visible seulement après acceptation</span>
              </span>
              <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="peer sr-only" />
              <span className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-success peer-focus-visible:ring-2 peer-focus-visible:ring-coral after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          )}

          <Button type="submit" size="lg" disabled={tooShort} className="mt-5 w-full">
            Envoyer
          </Button>
        </form>
      )}
    </Sheet>
  );
}
