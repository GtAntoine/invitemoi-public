import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { addDays, formatISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Gift, HandHeart, X } from 'lucide-react';
import clsx from 'clsx';
import { CATEGORIES, CATEGORY_ORDER, CITIES, KINDS } from '../lib/catalog';
import { shortDay } from '../lib/format';
import { useDemo } from '../lib/store';
import type { Category, Outing, OutingKind } from '../lib/types';
import { EventCard } from '../components/EventCard';
import { Button, ButtonLink, Chip } from '../components/ui/primitives';

type Draft = Omit<Outing, 'id' | 'ownerId' | 'createdAt'>;
const STEPS = ['Envie', 'Sortie', 'Quand et où', 'Aperçu'];
const TIMES = ['12:00', '12:30', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

const field =
  'w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] placeholder:text-muted focus:border-ink focus:outline-none';

function Label({ children, htmlFor, hint }: { children: string; htmlFor?: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block">
      <span className="font-semibold">{children}</span>
      {hint && <span className="ml-2 text-sm text-muted">{hint}</span>}
    </label>
  );
}

export function CreatePage() {
  const { me, createOuting } = useDemo();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preset = params.get('type');
  const [step, setStep] = useState(preset === 'offer' || preset === 'wish' ? 1 : 0);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({
    kind: preset === 'wish' ? 'wish' : 'offer',
    category: 'restaurant',
    title: '',
    description: '',
    venue: '',
    city: me?.city ?? 'Paris',
    date: formatISO(addDays(new Date(), 2), { representation: 'date' }),
    time: '20:00',
  });

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => formatISO(addDays(new Date(), i), { representation: 'date' })),
    [],
  );

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const canContinue = [
    true,
    draft.title.trim().length >= 6 && draft.description.trim().length >= 20,
    draft.venue.trim().length >= 3,
    true,
  ][step];

  const preview: Outing = { ...draft, id: 'preview', ownerId: me?.id ?? '', createdAt: new Date().toISOString() };

  if (publishedId) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center">
        <motion.span
          initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 220 }}
          className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-coral text-white"
        >
          <Check className="h-12 w-12" strokeWidth={2.5} />
        </motion.span>
        <h1 className="text-3xl font-bold">Ton annonce est en ligne</h1>
        <p className="mt-2 text-muted">
          {draft.kind === 'offer'
            ? 'Les personnes intéressées vont t’écrire. Tu choisiras celle qui t’accompagne.'
            : 'Les hôtes intéressés vont te proposer de t’inviter. Tu choisiras.'}
        </p>
        <p className="mt-4 rounded-2xl bg-sunken px-4 py-2 text-xs text-muted">
          Dans la démo, les premières réponses arrivent dans quelques secondes.
        </p>
        <div className="mt-8 flex w-full flex-col gap-2">
          <ButtonLink to={`/mes-sorties/${publishedId}`} size="lg">
            Suivre les réponses
          </ButtonLink>
          <ButtonLink to="/explorer" variant="ghost">
            Retour à l’exploration
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-sunken">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
        ) : (
          <span />
        )}
        <Link to="/explorer" aria-label="Annuler la création" className="grid h-10 w-10 place-items-center rounded-full hover:bg-sunken">
          <X className="h-5 w-5" />
        </Link>
      </div>

      <ol className="mb-8 flex gap-1.5" aria-label="Étapes">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <span className={clsx('block h-1.5 rounded-full transition-colors', i <= step ? 'bg-coral' : 'bg-line')} />
            <span className={clsx('mt-2 hidden text-xs font-semibold sm:block', i === step ? 'text-ink' : 'text-muted')}>{s}</span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
          {step === 0 && (
            <div>
              <h1 className="text-3xl font-bold">Qu’est-ce qui te tente&nbsp;?</h1>
              <p className="mt-2 text-muted">Les deux sont aussi bien vus l’un que l’autre. Ça dépend juste de ton mois.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(['offer', 'wish'] as OutingKind[]).map((k) => {
                  const Icon = k === 'offer' ? Gift : HandHeart;
                  return (
                    <button
                      key={k}
                      onClick={() => {
                        set({ kind: k });
                        setStep(1);
                      }}
                      className="group flex flex-col items-start rounded-[28px] border-2 border-line bg-surface p-6 text-left transition-colors hover:border-ink"
                    >
                      <span className={clsx('mb-6 grid h-14 w-14 md:mb-10 place-items-center rounded-2xl', k === 'offer' ? 'bg-coral text-white' : 'bg-saffron text-[#3A2A00]')}>
                        <Icon className="h-7 w-7" />
                      </span>
                      <span className="font-display text-2xl font-bold">{KINDS[k].createTitle}</span>
                      <span className="mt-1 text-sm text-muted">{KINDS[k].createHint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{draft.kind === 'offer' ? 'Tu invites à quoi ?' : 'Tu rêves de quoi ?'}</h1>
              <div>
                <Label>Catégorie</Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {CATEGORY_ORDER.map((c: Category) => {
                    const { icon: Icon, label, poster } = CATEGORIES[c];
                    const active = draft.category === c;
                    return (
                      <button
                        key={c}
                        onClick={() => set({ category: c })}
                        aria-pressed={active}
                        className={clsx(
                          'flex flex-col items-center gap-2 rounded-2xl border-2 py-3 text-sm font-semibold transition-colors',
                          active ? 'border-ink bg-surface' : 'border-transparent bg-sunken hover:border-line',
                        )}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl text-[#FBF4EA]" style={{ background: poster }}>
                          <Icon className="h-5 w-5" />
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="title" hint="Le plus concret possible">
                  Titre
                </Label>
                <input id="title" value={draft.title} onChange={(e) => set({ title: e.target.value })} maxLength={70} placeholder={CATEGORIES[draft.category].example} className={field} />
              </div>
              <div>
                <Label htmlFor="description" hint="Ce qui te donne envie, et avec qui">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={draft.description}
                  onChange={(e) => set({ description: e.target.value })}
                  rows={4}
                  maxLength={400}
                  placeholder={
                    draft.kind === 'offer'
                      ? 'J’ai deux places et j’aimerais les partager avec quelqu’un qui…'
                      : 'Ça fait longtemps que je veux y aller. En échange, je promets…'
                  }
                  className={clsx(field, 'resize-none leading-relaxed')}
                />
                <p className="mt-1 text-xs text-muted">{Math.max(0, 20 - draft.description.trim().length) > 0 ? `Encore ${20 - draft.description.trim().length} caractères minimum` : `${draft.description.length}/400`}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Quand et où&nbsp;?</h1>
              <div>
                <Label hint="Dans les 7 prochains jours">Jour</Label>
                <div className="grid grid-cols-7 gap-1.5">
                  {days.map((d) => {
                    const l = shortDay(d);
                    const active = draft.date === d;
                    return (
                      <button
                        key={d}
                        onClick={() => set({ date: d })}
                        aria-pressed={active}
                        className={clsx('flex flex-col items-center rounded-2xl py-2.5 transition-colors', active ? 'bg-ink text-bg' : 'bg-sunken hover:bg-line')}
                      >
                        <span className="text-[11px] font-semibold opacity-70">{l.top}</span>
                        <span className="font-display text-xl font-bold">{l.bottom}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label>Heure</Label>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((t) => (
                    <Chip key={t} active={draft.time === t} onClick={() => set({ time: t })}>
                      {t.replace(':', 'h')}
                    </Chip>
                  ))}
                  <input
                    type="time"
                    aria-label="Autre heure"
                    value={draft.time}
                    onChange={(e) => e.target.value && set({ time: e.target.value })}
                    className="h-9 rounded-full border border-line bg-surface px-3 text-sm"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <Label htmlFor="venue">Lieu</Label>
                  <input id="venue" value={draft.venue} onChange={(e) => set({ venue: e.target.value })} placeholder="Nom du lieu, adresse…" className={field} />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <select id="city" value={draft.city} onChange={(e) => set({ city: e.target.value })} className={clsx(field, 'appearance-none')}>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold">Ça donne envie&nbsp;?</h1>
              <p className="mt-2 text-muted">Voici ton annonce telle que les autres la verront.</p>
              <div className="pointer-events-none mx-auto mt-6 max-w-sm">
                <EventCard outing={preview} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <div className="sticky bottom-4 mt-10 md:bottom-6">
          <Button
            size="lg"
            className="w-full"
            disabled={!canContinue}
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else {
                const id = createOuting({ ...draft, title: draft.title.trim(), description: draft.description.trim(), venue: draft.venue.trim() });
                setPublishedId(id);
                window.scrollTo({ top: 0 });
              }
            }}
          >
            {step < 3 ? 'Continuer' : 'Publier l’annonce'}
          </Button>
          {step === 3 && (
            <button onClick={() => navigate('/explorer')} className="mt-3 w-full text-center text-sm font-semibold text-muted hover:text-ink">
              Abandonner
            </button>
          )}
        </div>
      )}
    </div>
  );
}
