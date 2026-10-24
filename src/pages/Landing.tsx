import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, HandHeart, Hand, Lock, MousePointerClick, Sparkles } from 'lucide-react';
import { useDemo } from '../lib/store';
import { EventCard } from '../components/EventCard';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/primitives';

const HERO_CARDS = ['o-septime', 'o-rothko', 'o-jazz'];

export function LandingPage() {
  const { signIn, outing } = useDemo();
  const navigate = useNavigate();

  const enter = () => {
    signIn();
    navigate('/explorer');
  };

  const cards = HERO_CARDS.map((id) => outing(id)).filter(Boolean);

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Logo />
        <Button variant="ink" size="sm" onClick={enter}>
          Entrer dans la démo
        </Button>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-8 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm font-medium text-muted">
            <Sparkles className="h-4 w-4 text-coral" />
            Sorties à deux · démo interactive
          </p>
          <h1 className="text-[44px] font-bold leading-[1.02] md:text-7xl">
            Flemme de dépenser&nbsp;?
            <br />
            <span className="relative inline-block text-coral">
              Fais-toi inviter.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden>
                <path d="M2 8 C 60 2, 120 12, 180 6 S 280 4, 298 7" stroke="rgb(var(--saffron))" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Ou invite quelqu’un. Restos, théâtre, expos, concerts&nbsp;: des sorties en tête-à-tête avec des gens qui partagent tes goûts.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={enter}>
              Essayer la démo
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/bienvenue')}>
              Créer mon profil
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">Sans inscription · données fictives · tout reste dans ton navigateur</p>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-[380px] lg:h-[480px]">
          {cards.map((o, i) => (
            <motion.div
              key={o!.id}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: [-7, 4, -2][i] }}
              transition={{ delay: 0.15 + i * 0.12, type: 'spring', damping: 16 }}
              className="pointer-events-none absolute w-[300px] sm:w-[330px]"
              style={{ top: [0, 90, 180][i], left: ['0%', '14%', '4%'][i], zIndex: i }}
              aria-hidden
            >
              <EventCard outing={o!} className="shadow-lift" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deux façons */}
      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <h2 className="mb-8 max-w-2xl text-3xl font-bold md:text-5xl">Deux façons de sortir. Aucune n’est gênante.</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[32px] bg-coral p-8 text-white md:p-10">
            <Gift className="h-10 w-10" />
            <h3 className="mt-10 text-3xl font-bold md:text-4xl">J’invite</h3>
            <p className="mt-3 max-w-md text-lg text-white/90">
              Deux places, une table réservée, l’envie de partager. Tu publies, tu reçois des candidatures, tu choisis la personne qui t’accompagne.
            </p>
          </div>
          <div className="rounded-[32px] bg-saffron p-8 text-[#2A1F00] md:p-10">
            <HandHeart className="h-10 w-10" />
            <h3 className="mt-10 text-3xl font-bold md:text-4xl">Invite-moi</h3>
            <p className="mt-3 max-w-md text-lg text-[#2A1F00]/80">
              Une expo te fait de l’œil, mais pas ton budget&nbsp;? Dis-le. Des hôtes te proposent de t’inviter, et c’est toi qui choisis.
            </p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-y border-line bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="mb-12 text-3xl font-bold md:text-5xl">Comment ça marche</h2>
          <ol className="grid gap-10 md:grid-cols-3">
            {[
              { icon: MousePointerClick, title: 'Publie ou réponds', body: 'Une annonce prend une minute : quoi, quand, où, et un mot sur ce qui te donne envie.' },
              { icon: Hand, title: 'Choisis en un geste', body: 'Les candidatures arrivent sous forme de cartes. Glisse à droite pour choisir, à gauche pour passer.' },
              { icon: Lock, title: 'Sortez', body: 'Au match, et seulement là, vos contacts sont échangés. Il ne reste qu’à profiter.' },
            ].map((s, i) => (
              <li key={s.title}>
                <span className="font-display text-6xl font-bold text-line">0{i + 1}</span>
                <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold">
                  <s.icon className="h-5 w-5 text-coral" />
                  {s.title}
                </h3>
                <p className="mt-2 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="flex flex-col items-start gap-6 rounded-[32px] bg-ink p-8 text-bg md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Deux minutes pour tout voir.</h2>
            <p className="mt-2 max-w-lg opacity-70">
              Explore les sorties, réponds à une annonce, publie la tienne et trie tes candidat·es. Les autres membres réagissent en direct.
            </p>
          </div>
          <Button size="lg" onClick={enter} className="shrink-0">
            Lancer la démo
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-4 py-8 text-sm text-muted md:flex-row md:justify-between md:px-6">
        <span>Invite Moi · projet portfolio, version 2</span>
        <a href="https://github.com/GtAntoine/invitemoi-public" className="font-semibold text-ink underline-offset-4 hover:underline">
          Lire l’étude de cas
        </a>
      </footer>
    </div>
  );
}
