import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useDemo } from '../lib/store';
import { DEMO_USER_ID } from '../lib/seed';
import { KINDS } from '../lib/catalog';
import { shortDay, timeLabel } from '../lib/format';
import { Logo } from '../components/Logo';
import { Ticket, serial } from '../components/Ticket';
import { Button } from '../components/ui/primitives';

/** Une annonce de chaque rôle, auxquelles le profil de démo n'a pas encore répondu. */
const PAIR = ['o-jazz', 'o-opera'];

const CONDITIONS = [
  ['Valable pour deux personnes.', 'Celle qui invite paie la sortie, l’autre apporte sa compagnie. Personne ne doit rien à personne.'],
  ['Chacun peut tenir les deux rôles.', 'Un soir tu invites, la semaine suivante tu te fais inviter. Les deux annonces se valent.'],
  ['L’auteur de l’annonce choisit.', 'Les réponses arrivent en pile de cartes : à droite pour choisir, à gauche pour passer.'],
  ['Contacts échangés au match seulement.', 'Tant que personne n’est choisi, rien de personnel ne circule.'],
  ['Ni rendez-vous galant, ni sortie de groupe.', 'Une sortie, deux personnes, des goûts en commun.'],
];

export function LandingPage() {
  const { signIn, outing, user, state } = useDemo();
  const navigate = useNavigate();
  const rail = useRef<HTMLUListElement>(null);
  const scrollRail = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth' });

  const enter = (to = '/explorer', apply = false) => {
    signIn();
    navigate(to, apply ? { state: { apply: true } } : undefined);
  };

  const pair = PAIR.map((id) => outing(id)).filter((o): o is NonNullable<typeof o> => Boolean(o));
  const billboard = state.outings
    .filter((o) => !PAIR.includes(o.id) && o.ownerId !== DEMO_USER_ID)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 8);

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Logo />
        <Button variant="ink" size="sm" onClick={() => enter()}>
          Lancer la démo
          <ArrowRight className="h-4 w-4" />
        </Button>
      </header>

      {/* La paire de tickets */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pb-24 md:pt-10">
        <h1 className="max-w-3xl text-[34px] font-bold leading-[1.05] text-balance sm:text-5xl lg:max-w-none lg:whitespace-nowrap lg:text-[52px]">
          Flemme de dépenser&nbsp;? Fais-toi inviter.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Ou invite quelqu’un. Restos, concerts, expos, théâtre&nbsp;: des sorties à deux, où l’un offre et l’autre accompagne.
        </p>

        <div className="mt-10 flex flex-col gap-6 md:mt-12 md:gap-0">
          {pair.map((o, i) => (
            <Ticket
              key={o.id}
              outing={o}
              owner={user(o.ownerId)}
              onTear={() => enter(`/sortie/${o.id}`, true)}
              className={clsx(
                'w-full md:max-w-[820px]',
                i === 0 ? 'md:-rotate-[1.2deg]' : 'md:-mt-3 md:ml-auto md:rotate-[1deg]',
              )}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-x-6 gap-y-3 text-[15px] text-muted sm:flex-row sm:items-center">
          <p>Deux annonces de la démo. Détache un talon pour y répondre.</p>
          <button
            type="button"
            onClick={() => navigate('/bienvenue')}
            className="self-start font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-coral"
          >
            Ou crée ton profil
          </button>
        </div>
      </section>

      {/* À l'affiche : le reste du programme, en talons */}
      <section aria-labelledby="affiche" className="border-y border-line bg-sunken/60 py-14 md:py-20">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-4 md:px-6">
          <div>
            <h2 id="affiche" className="text-3xl font-bold md:text-4xl">
              À l’affiche cette semaine
            </h2>
            <p className="mt-2 text-muted">Paris, Lyon, Marseille, Bordeaux, Lille. Toutes les annonces sont fictives.</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Button variant="secondary" size="md" className="hidden w-11 !px-0 md:inline-flex" onClick={() => scrollRail(-1)} aria-label="Annonces précédentes">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="md" className="hidden w-11 !px-0 md:inline-flex" onClick={() => scrollRail(1)} aria-label="Annonces suivantes">
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="secondary" onClick={() => enter()}>
              Tout le programme
            </Button>
          </div>
        </div>

        {/* Le rail déborde jusqu'au bord de l'écran, mais son premier talon s'aligne sur le texte. */}
        <ul
          ref={rail}
          className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [--gutter:1rem] md:[--gutter:max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
          style={{ paddingInline: 'var(--gutter)', scrollPaddingInline: 'var(--gutter)' }}
        >
          {billboard.map((o) => {
            const d = shortDay(o.date);
            const offer = o.kind === 'offer';
            return (
              <li key={o.id} className="snap-start">
                <button
                  type="button"
                  aria-label={`${KINDS[o.kind].badge} : ${o.title}`}
                  onClick={() => enter(`/sortie/${o.id}`)}
                  className="group flex h-full w-[248px] overflow-hidden rounded-2xl bg-surface text-left shadow-card transition-transform duration-200 hover:-translate-y-1"
                >
                  <span
                    className={clsx(
                      'flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 border-r-2 border-dotted',
                      offer ? 'border-white/40 bg-[#D63F22] text-white' : 'border-[#2A1F00]/25 bg-[#F6B634] text-[#2A1F00]',
                    )}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider">{d.top.replace('.', '')}</span>
                    <span className="font-display text-2xl font-bold tabular-nums leading-none">{d.bottom}</span>
                    <span className="text-[11px] tabular-nums">{timeLabel(o.time)}</span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col p-3.5">
                    <span className="line-clamp-2 font-semibold leading-snug">{o.title}</span>
                    <span className="mt-auto truncate pt-2 text-sm text-muted">
                      {user(o.ownerId).firstName} · {o.city}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Au dos du billet : le revers du même billet, encoches et perforation comprises. */}
      <section aria-labelledby="dos" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col drop-shadow-[0_14px_24px_rgb(var(--shadow)/0.14)] md:flex-row">
          <div className="ticket-main min-w-0 flex-1 rounded-t-[22px] bg-surface p-6 sm:p-10 md:rounded-l-[22px] md:rounded-tr-none">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
              <h2 id="dos" className="text-3xl font-bold md:text-4xl">
                Au dos du billet
              </h2>
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-muted tabular-nums sm:inline">
                Conditions · N° {serial('conditions')}
              </span>
            </div>
            <dl className="mt-2 divide-y divide-line text-[15px]">
              {CONDITIONS.map(([term, detail]) => (
                <div key={term} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="ticket-stub relative flex flex-col justify-between gap-8 rounded-b-[22px] bg-surface p-6 sm:p-10 md:w-[320px] md:rounded-r-[22px] md:rounded-bl-none">
            <span aria-hidden className="ticket-perf absolute inset-x-6 top-1 h-1.5 md:inset-x-auto md:inset-y-6 md:left-1 md:h-auto md:w-1.5" />
            <div>
              <p className="font-display text-2xl font-bold leading-tight">Deux minutes pour tout essayer.</p>
              <p className="mt-3 text-muted">
                Réponds à une annonce, publie la tienne, trie les réponses. Les autres membres réagissent en direct, et tout reste dans ton navigateur.
              </p>
            </div>
            <div className="space-y-4">
              <Button size="lg" className="w-full" onClick={() => enter()}>
                Lancer la démo
                <ArrowRight className="h-5 w-5" />
              </Button>
              <p className="text-sm text-muted">Sans inscription · données fictives</p>
            </div>
          </div>
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
