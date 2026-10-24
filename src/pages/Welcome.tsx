import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { CITIES, INTERESTS } from '../lib/catalog';
import { useDemo } from '../lib/store';
import { Logo } from '../components/Logo';
import { Button, Chip } from '../components/ui/primitives';
import { useToast } from '../components/ui/Toast';

const MIN_INTERESTS = 3;

export function WelcomePage() {
  const { state, signIn } = useDemo();
  const navigate = useNavigate();
  const toast = useToast();
  const base = state.users['u-camille'];
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('Paris');
  const [interests, setInterests] = useState<string[]>([]);

  const toggle = (i: string) => setInterests((list) => (list.includes(i) ? list.filter((x) => x !== i) : [...list, i]));

  const finish = (next: string) => {
    const name = firstName.trim() || base.firstName;
    signIn({
      firstName: name,
      age: Number(age) >= 18 ? Number(age) : base.age,
      city,
      interests: interests.length ? interests : base.interests,
    });
    toast.show({ title: `Bienvenue ${name} !`, body: 'Ton profil est prêt. Les sorties autour de toi t’attendent.', tone: 'success' });
    navigate(next);
  };

  const valid = [firstName.trim().length >= 2 && Number(age) >= 18, interests.length >= MIN_INTERESTS][step] ?? true;

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-8">
      <header className="flex h-16 items-center justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-sunken">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
        ) : (
          <Logo />
        )}
        <button onClick={() => finish('/explorer')} className="text-sm font-semibold text-muted hover:text-ink">
          Passer
        </button>
      </header>

      <div className="mb-8 mt-2 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={clsx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-coral' : 'bg-line')} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="flex-1">
          {step === 0 && (
            <div className="space-y-5">
              <h1 className="text-4xl font-bold">On fait connaissance&nbsp;?</h1>
              <p className="text-muted">Juste l’essentiel. Le reste viendra pendant les sorties.</p>
              <label className="block">
                <span className="mb-1.5 block font-semibold">Ton prénom</span>
                <input autoFocus value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Camille" className="w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-lg focus:border-ink focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-semibold">Ton âge</span>
                <input inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="29" className="w-32 rounded-2xl border border-line bg-surface px-4 py-3.5 text-lg focus:border-ink focus:outline-none" />
                {age && Number(age) < 18 && <span className="mt-1 block text-sm text-danger">Invite Moi est réservé aux plus de 18 ans.</span>}
              </label>
              <div>
                <span className="mb-1.5 block font-semibold">Ta ville</span>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => (
                    <Chip key={c} active={city === c} onClick={() => setCity(c)}>
                      {c}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h1 className="text-4xl font-bold">Qu’est-ce qui te fait sortir&nbsp;?</h1>
              <p className="mt-2 text-muted">Choisis-en au moins {MIN_INTERESTS}. On s’en sert pour te montrer tes points communs avec les autres.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <Chip key={i} active={interests.includes(i)} onClick={() => toggle(i)}>
                    {i}
                  </Chip>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h1 className="text-4xl font-bold">Par quoi on commence&nbsp;?</h1>
              <p className="mt-2 text-muted">Tu pourras faire les deux, quand tu veux.</p>
              <div className="mt-6 space-y-3">
                <button onClick={() => finish('/explorer')} className="w-full rounded-[28px] border-2 border-line bg-surface p-5 text-left hover:border-ink">
                  <span className="font-display text-xl font-bold">Voir les sorties autour de moi</span>
                  <span className="mt-1 block text-sm text-muted">Des gens invitent, d’autres cherchent un hôte.</span>
                </button>
                <button onClick={() => finish('/creer?type=offer')} className="w-full rounded-[28px] border-2 border-line bg-surface p-5 text-left hover:border-ink">
                  <span className="font-display text-xl font-bold text-coral">J’invite quelqu’un</span>
                  <span className="mt-1 block text-sm text-muted">Publier une sortie que j’offre.</span>
                </button>
                <button onClick={() => finish('/creer?type=wish')} className="w-full rounded-[28px] border-2 border-line bg-surface p-5 text-left hover:border-ink">
                  <span className="font-display text-xl font-bold text-saffron-ink">Je me fais inviter</span>
                  <span className="mt-1 block text-sm text-muted">Dire où j’aimerais aller.</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 2 && (
        <Button size="lg" className="mt-8 w-full" disabled={!valid} onClick={() => setStep(step + 1)}>
          Continuer
        </Button>
      )}
    </div>
  );
}
