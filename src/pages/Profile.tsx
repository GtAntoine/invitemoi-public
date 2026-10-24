import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Instagram, Languages, Lock, MapPin, Pencil, Settings, Star } from 'lucide-react';
import { CITIES, INTERESTS } from '../lib/catalog';
import { memberSince } from '../lib/format';
import { useDemo } from '../lib/store';
import type { User } from '../lib/types';
import { EventCard } from '../components/EventCard';
import { Sheet } from '../components/ui/Sheet';
import { Avatar, Button, ButtonLink, Chip, Tag, Verified } from '../components/ui/primitives';
import { useToast } from '../components/ui/Toast';
import { NotFoundPage } from './NotFound';

function EditProfileSheet({ open, onClose, me }: { open: boolean; onClose: () => void; me: User }) {
  const { updateMe } = useDemo();
  const toast = useToast();
  const [draft, setDraft] = useState(me);

  const toggle = (i: string) =>
    setDraft((d) => ({ ...d, interests: d.interests.includes(i) ? d.interests.filter((x) => x !== i) : [...d.interests, i] }));

  return (
    <Sheet open={open} onClose={onClose} title="Modifier mon profil">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          updateMe({ ...draft, firstName: draft.firstName.trim() || me.firstName, instagram: draft.instagram?.replace(/^@/, '').trim() || undefined });
          toast.show({ title: 'Profil mis à jour', tone: 'success' });
          onClose();
        }}
      >
        <div className="grid grid-cols-[1fr_96px] gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Prénom</span>
            <input value={draft.firstName} onChange={(e) => setDraft({ ...draft, firstName: e.target.value })} className="w-full rounded-2xl border border-line bg-surface px-4 py-3 focus:border-ink focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Âge</span>
            <input type="number" min={18} max={99} value={draft.age} onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })} className="w-full rounded-2xl border border-line bg-surface px-4 py-3 focus:border-ink focus:outline-none" />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Ville</span>
          <select value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="w-full appearance-none rounded-2xl border border-line bg-surface px-4 py-3 focus:border-ink focus:outline-none">
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">À propos</span>
          <textarea rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} maxLength={240} className="w-full resize-none rounded-2xl border border-line bg-surface px-4 py-3 leading-relaxed focus:border-ink focus:outline-none" />
        </label>
        <div>
          <span className="mb-1.5 block text-sm font-semibold">Centres d’intérêt</span>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <Chip key={i} active={draft.interests.includes(i)} onClick={() => toggle(i)}>
                {i}
              </Chip>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Instagram</span>
          <div className="flex items-center rounded-2xl border border-line bg-surface px-4 focus-within:border-ink">
            <span className="text-muted">@</span>
            <input value={draft.instagram ?? ''} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} className="w-full bg-transparent px-1 py-3 focus:outline-none" />
          </div>
          <span className="mt-1 block text-xs text-muted">Partagé uniquement avec les personnes avec qui tu as un match.</span>
        </label>
        <Button type="submit" size="lg" className="w-full">
          Enregistrer
        </Button>
      </form>
    </Sheet>
  );
}

export function ProfilePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { state, me } = useDemo();
  const [editing, setEditing] = useState(false);
  const person = state.users[id];

  if (!person || !me) return <NotFoundPage embedded />;

  const isMe = person.id === me.id;
  const shared = new Set(isMe ? [] : person.interests.filter((i) => me.interests.includes(i)));
  const open = state.outings.filter((o) => o.ownerId === person.id && !state.applications.some((a) => a.outingId === o.id && a.status === 'accepted'));
  const matched = state.applications.some(
    (a) =>
      a.status === 'accepted' &&
      ((a.userId === me.id && state.outings.find((o) => o.id === a.outingId)?.ownerId === person.id) ||
        (a.userId === person.id && state.outings.find((o) => o.id === a.outingId)?.ownerId === me.id)),
  );

  const stats = [
    { value: person.hosted, label: 'invitations offertes' },
    { value: person.attended, label: 'fois invité·e' },
    { value: person.rating.toFixed(1), label: 'note moyenne', star: true },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        {!isMe ? (
          <button onClick={() => navigate(-1)} className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-sunken">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
        ) : (
          <h1 className="text-3xl font-bold md:text-4xl">Mon profil</h1>
        )}
        {isMe && (
          <ButtonLink to="/reglages" variant="ghost" size="sm" aria-label="Réglages">
            <Settings className="h-5 w-5" />
            <span className="hidden sm:inline">Réglages</span>
          </ButtonLink>
        )}
      </div>

      <section className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-card">
        <div className="h-24 bg-[linear-gradient(110deg,rgb(var(--saffron))_0%,rgb(var(--coral))_100%)] opacity-90" />
        <div className="px-6 pb-6">
          <div className="relative -mt-12 flex items-end justify-between gap-4">
            <span className="rounded-full ring-4 ring-surface">
              <Avatar user={person} size={96} />
            </span>
            {isMe && (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
            )}
          </div>
          <h2 className="mt-4 flex items-center gap-2 text-3xl font-bold">
            {person.firstName}, {person.age} {person.verified && <Verified className="h-6 w-6" />}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" />
            {person.city} · Membre depuis {memberSince(person.memberSince)}
          </p>
          <p className="mt-4 text-[17px] leading-relaxed">{person.bio}</p>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-2xl bg-sunken py-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="px-2">
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-center justify-center gap-1 font-display text-2xl font-bold">
                  {s.star && <Star className="h-5 w-5 fill-saffron text-saffron" />}
                  {s.value}
                </dd>
                <dd className="text-xs text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-surface p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Centres d’intérêt
            {shared.size > 0 && <span className="ml-2 text-sm font-normal text-coral">{shared.size} en commun avec toi</span>}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {[...person.interests].sort((a, b) => Number(shared.has(b)) - Number(shared.has(a))).map((i) => (
              <Tag key={i} highlight={shared.has(i)}>
                {i}
              </Tag>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-[28px] border border-line bg-surface p-6">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              <Languages className="h-5 w-5 text-muted" />
              Langues
            </h3>
            <p>{person.languages.join(' · ')}</p>
          </div>
          {person.instagram && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <Instagram className="h-5 w-5 text-muted" />
                Instagram
              </h3>
              {isMe || matched ? (
                <a href={`https://instagram.com/${person.instagram}`} target="_blank" rel="noreferrer" className="font-semibold underline-offset-4 hover:underline">
                  @{person.instagram}
                </a>
              ) : (
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Lock className="h-4 w-4" />
                  Visible après un match
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {open.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 text-xl font-semibold">{isMe ? 'Mes annonces en cours' : `Les annonces de ${person.firstName}`}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {open.map((o) => (
              <EventCard key={o.id} outing={o} />
            ))}
          </div>
        </section>
      )}

      {isMe && editing && <EditProfileSheet open={editing} onClose={() => setEditing(false)} me={me} />}
    </div>
  );
}
