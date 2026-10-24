import { useMemo, useState } from 'react';
import { addDays, formatISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, MapPin, SearchX } from 'lucide-react';
import clsx from 'clsx';
import { CATEGORIES, CATEGORY_ORDER, CITIES } from '../lib/catalog';
import { shortDay } from '../lib/format';
import { useDemo } from '../lib/store';
import type { Category, OutingKind } from '../lib/types';
import { EventCard } from '../components/EventCard';
import { Button, ButtonLink, Chip, EmptyState } from '../components/ui/primitives';
import { Sheet } from '../components/ui/Sheet';

const FILTER_KEY = 'invitemoi-filters';

interface Filters {
  kind: OutingKind | 'all';
  day: string | 'all';
  categories: Category[];
  city: string;
}

function loadFilters(defaultCity: string): Filters {
  try {
    const raw = sessionStorage.getItem(FILTER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignoré
  }
  return { kind: 'all', day: 'all', categories: [], city: defaultCity };
}

const KIND_OPTIONS: { value: OutingKind | 'all'; label: string; hint: string }[] = [
  { value: 'all', label: 'Tout', hint: '' },
  { value: 'offer', label: 'Être invité·e', hint: 'Des gens qui offrent une sortie' },
  { value: 'wish', label: 'Inviter', hint: 'Des gens qui cherchent un hôte' },
];

export function ExplorePage() {
  const { state, me } = useDemo();
  const [filters, setFiltersState] = useState<Filters>(() => loadFilters(me?.city ?? 'Paris'));
  const [cityOpen, setCityOpen] = useState(false);

  const setFilters = (patch: Partial<Filters>) => {
    setFiltersState((f) => {
      const next = { ...f, ...patch };
      try {
        sessionStorage.setItem(FILTER_KEY, JSON.stringify(next));
      } catch {
        // ignoré
      }
      return next;
    });
  };

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => formatISO(addDays(new Date(), i), { representation: 'date' })),
    [],
  );

  const inCity = state.outings.filter((o) => filters.city === 'Partout' || o.city === filters.city);
  const results = inCity
    .filter((o) => filters.kind === 'all' || o.kind === filters.kind)
    .filter((o) => filters.day === 'all' || o.date === filters.day)
    .filter((o) => filters.categories.length === 0 || filters.categories.includes(o.category))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const toggleCategory = (c: Category) =>
    setFilters({
      categories: filters.categories.includes(c) ? filters.categories.filter((x) => x !== c) : [...filters.categories, c],
    });

  const activeFilters = (filters.kind !== 'all' ? 1 : 0) + (filters.day !== 'all' ? 1 : 0) + filters.categories.length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Salut {me?.firstName}</p>
          <h1 className="text-3xl font-bold md:text-4xl">Cette semaine, on sort où&nbsp;?</h1>
        </div>
        <button
          onClick={() => setCityOpen(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface pl-3 pr-3.5 text-sm font-semibold hover:bg-sunken"
        >
          <MapPin className="h-4 w-4 text-coral" />
          {filters.city}
          <ChevronDown className="h-4 w-4 text-muted" />
        </button>
      </div>

      {/* Ce que je cherche : le filtre le plus structurant, en premier */}
      <div role="radiogroup" aria-label="Type de sortie" className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-sunken p-1 md:inline-grid md:w-auto">
        {KIND_OPTIONS.map((o) => (
          <button
            key={o.value}
            role="radio"
            aria-checked={filters.kind === o.value}
            title={o.hint}
            onClick={() => setFilters({ kind: o.value })}
            className={clsx(
              'relative h-10 rounded-xl px-3 text-[13px] font-semibold transition-colors md:px-5 md:text-sm',
              filters.kind === o.value ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {filters.kind === o.value && (
              <motion.span layoutId="kind-pill" className="absolute inset-0 rounded-xl bg-surface shadow-card dark:bg-line" transition={{ type: 'spring', damping: 30, stiffness: 400 }} />
            )}
            <span className="relative">{o.label}</span>
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Chip active={filters.day === 'all'} onClick={() => setFilters({ day: 'all' })}>
          Toute la semaine
        </Chip>
        {days.map((d) => {
          const label = shortDay(d);
          return (
            <Chip key={d} active={filters.day === d} onClick={() => setFilters({ day: filters.day === d ? 'all' : d })}>
              {label.top} {label.bottom}
            </Chip>
          );
        })}
      </div>

      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {CATEGORY_ORDER.map((c) => {
          const { icon: Icon, label } = CATEGORIES[c];
          return (
            <Chip key={c} active={filters.categories.includes(c)} onClick={() => toggleCategory(c)}>
              <Icon className="h-4 w-4" />
              {label}
            </Chip>
          );
        })}
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <span>
          {results.length} sortie{results.length > 1 ? 's' : ''} {filters.city === 'Partout' ? 'partout en France' : `à ${filters.city}`}
        </span>
        {activeFilters > 0 && (
          <button onClick={() => setFilters({ kind: 'all', day: 'all', categories: [] })} className="font-semibold text-ink underline-offset-4 hover:underline">
            Effacer les filtres
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((o) => (
              <motion.div
                key={o.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="flex min-w-0"
              >
                <EventCard outing={o} className="w-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          icon={<SearchX className="h-6 w-6" />}
          title="Rien pour ces critères"
          body="Élargis la date ou les catégories. Ou lance ta propre annonce : c'est souvent comme ça que les meilleures sorties commencent."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={() => setFilters({ kind: 'all', day: 'all', categories: [] })}>
                Effacer les filtres
              </Button>
              <ButtonLink to="/creer">Créer une annonce</ButtonLink>
            </div>
          }
        />
      )}

      <Sheet open={cityOpen} onClose={() => setCityOpen(false)} title="Où veux-tu sortir ?">
        <ul className="divide-y divide-line">
          {[...CITIES, 'Partout'].map((city) => {
            const count = city === 'Partout' ? state.outings.length : state.outings.filter((o) => o.city === city).length;
            return (
              <li key={city}>
                <button
                  onClick={() => {
                    setFilters({ city });
                    setCityOpen(false);
                  }}
                  className="flex w-full items-center justify-between py-3.5 text-left"
                >
                  <span>
                    <span className="font-semibold">{city === 'Partout' ? 'Partout en France' : city}</span>
                    <span className="ml-2 text-sm text-muted">{count} sortie{count > 1 ? 's' : ''}</span>
                  </span>
                  {filters.city === city && <Check className="h-5 w-5 text-coral" />}
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    </div>
  );
}
