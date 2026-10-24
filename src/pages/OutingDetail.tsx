import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Instagram, MapPin, Navigation, Share2, Star, Trash2, Users } from 'lucide-react';
import { KINDS } from '../lib/catalog';
import { dayLabel, plural, timeLabel } from '../lib/format';
import { useDemo } from '../lib/store';
import { EventCover } from '../components/EventCard';
import { ApplySheet } from '../components/ApplySheet';
import { StatusPill } from '../components/StatusPill';
import { Sheet } from '../components/ui/Sheet';
import { Avatar, Button, ButtonLink, Tag, Verified } from '../components/ui/primitives';
import { useToast } from '../components/ui/Toast';
import { NotFoundPage } from './NotFound';

export function OutingDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { outing: find, user, me, applicationsFor, myApplicationTo, withdraw, deleteOuting } = useDemo();
  const [applyOpen, setApplyOpen] = useState(false);
  const [confirm, setConfirm] = useState<'withdraw' | 'delete' | null>(null);

  const outing = find(id);
  if (!outing || !me) return <NotFoundPage embedded />;

  const owner = user(outing.ownerId);
  const apps = applicationsFor(outing.id);
  const mine = myApplicationTo(outing.id);
  const isOwn = outing.ownerId === me.id;
  const accepted = apps.find((a) => a.status === 'accepted');
  const shared = owner.interests.filter((i) => me.interests.includes(i));
  const kind = KINDS[outing.kind];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${outing.venue}, ${outing.city}`)}`;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: outing.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.show({ title: 'Lien copié', body: 'Colle-le où tu veux pour partager la sortie.', tone: 'success' });
      }
    } catch {
      // Partage annulé par l'utilisateur.
    }
  };

  const action = (() => {
    if (isOwn) {
      const pending = apps.filter((a) => a.status === 'pending').length;
      return (
        <div className="space-y-3">
          <ButtonLink to={`/mes-sorties/${outing.id}`} size="lg" className="w-full">
            <Users className="h-5 w-5" />
            {accepted ? 'Voir ton match' : pending > 0 ? `Choisir parmi ${plural(pending, 'candidat·e', 'candidat·es')}` : 'Voir les candidatures'}
          </ButtonLink>
          <Button variant="ghost" className="w-full text-danger" onClick={() => setConfirm('delete')}>
            <Trash2 className="h-4 w-4" />
            Supprimer l’annonce
          </Button>
        </div>
      );
    }
    if (mine?.status === 'accepted') {
      return (
        <div className="rounded-3xl bg-success-soft p-5">
          <p className="font-display text-xl font-bold text-success">C’est un match&nbsp;!</p>
          <p className="mt-1 text-sm">
            {owner.firstName} a dit oui. Écris-lui pour caler les derniers détails.
          </p>
          {owner.instagram && (
            <a
              href={`https://instagram.com/${owner.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 rounded-2xl bg-surface p-3 font-semibold"
            >
              <Instagram className="h-5 w-5" />@{owner.instagram}
            </a>
          )}
        </div>
      );
    }
    if (mine) {
      return (
        <div className="space-y-3 rounded-3xl border border-line p-5">
          <StatusPill status={mine.status} kind={outing.kind} />
          <p className="text-sm text-muted">
            {mine.status === 'pending'
              ? `${owner.firstName} n’a pas encore choisi. On te prévient dès qu’il y a du nouveau.`
              : `${owner.firstName} a choisi quelqu’un d’autre cette fois. D’autres sorties t’attendent.`}
          </p>
          <blockquote className="rounded-2xl bg-sunken p-3 text-sm italic">« {mine.message} »</blockquote>
          {mine.status === 'pending' && (
            <Button variant="ghost" size="sm" className="-ml-2 text-muted" onClick={() => setConfirm('withdraw')}>
              Retirer ma demande
            </Button>
          )}
        </div>
      );
    }
    if (accepted) {
      return (
        <div className="rounded-3xl border border-line p-5 text-sm text-muted">
          {owner.firstName} a déjà trouvé quelqu’un pour cette sortie.
        </div>
      );
    }
    return (
      <Button size="lg" className="w-full" onClick={() => setApplyOpen(true)}>
        {kind.cta}
      </Button>
    );
  })();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/explorer'))} className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-sunken">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
        <button onClick={share} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-sunken">
          <Share2 className="h-4 w-4" />
          Partager
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <EventCover outing={outing} large className="h-44 rounded-[28px] md:h-72" />
          <h1 className="mt-6 text-3xl font-bold leading-tight text-balance md:text-4xl">{outing.title}</h1>
          <p className="mt-2 text-muted">
            {isOwn
              ? outing.kind === 'offer'
                ? 'Ton annonce : tu offres la sortie.'
                : 'Ton annonce : tu cherches quelqu’un pour t’inviter.'
              : outing.kind === 'offer'
                ? `${owner.firstName} t’invite : la sortie est offerte.`
                : `${owner.firstName} cherche quelqu’un pour l’inviter.`}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
              <div>
                <p className="font-semibold">{dayLabel(outing.date)}</p>
                <p className="text-sm text-muted">à {timeLabel(outing.time)}</p>
              </div>
            </div>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="group flex gap-3 rounded-2xl border border-line bg-surface p-4 hover:bg-sunken">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{outing.venue}</p>
                <p className="text-sm text-muted">{outing.city}</p>
              </div>
              <Navigation className="h-4 w-4 shrink-0 text-muted group-hover:text-ink" />
            </a>
          </div>

          <div className="mt-6 lg:hidden">{action}</div>

          <h2 className="mt-8 text-lg font-semibold">Le mot de {isOwn ? 'ton annonce' : owner.firstName}</h2>
          <p className="mt-2 whitespace-pre-line text-[17px] leading-relaxed">{outing.description}</p>

          {apps.length > 0 && !isOwn && (
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {apps.slice(0, 4).map((a) => (
                  <Avatar key={a.id} user={user(a.userId)} size={32} ring />
                ))}
              </div>
              <p className="text-sm text-muted">
                {plural(apps.length, 'personne a', 'personnes ont')} déjà répondu
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {!isOwn && (
            <Link to={`/profil/${owner.id}`} className="block rounded-3xl border border-line bg-surface p-5 shadow-card hover:bg-sunken/40">
              <div className="flex items-center gap-3">
                <Avatar user={owner} size={56} />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 font-display text-xl font-semibold">
                    {owner.firstName}, {owner.age} ans {owner.verified && <Verified />}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-muted">
                    <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
                    {owner.rating.toFixed(1)} · {plural(owner.hosted + owner.attended, 'sortie', 'sorties')}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted">{owner.bio}</p>
              {shared.length > 0 && (
                <>
                  <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-muted">
                    {plural(shared.length, 'point commun', 'points communs')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {shared.map((i) => (
                      <Tag key={i} highlight>
                        {i}
                      </Tag>
                    ))}
                  </div>
                </>
              )}
            </Link>
          )}
          <div className="hidden lg:block">{action}</div>
        </aside>
      </div>

      {/* La feuille reste montée après l'envoi pour afficher la confirmation. */}
      {!isOwn && (!mine || applyOpen) && <ApplySheet outing={outing} open={applyOpen} onClose={() => setApplyOpen(false)} />}

      <Sheet open={confirm !== null} onClose={() => setConfirm(null)} title={confirm === 'delete' ? 'Supprimer l’annonce ?' : 'Retirer ta demande ?'}>
        <p className="text-muted">
          {confirm === 'delete'
            ? 'Les personnes qui ont répondu seront prévenues que la sortie est annulée.'
            : `${owner.firstName} ne verra plus ton message. Tu pourras répondre à nouveau plus tard.`}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setConfirm(null)}>
            Garder
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm === 'delete') {
                deleteOuting(outing.id);
                navigate('/mes-sorties', { replace: true });
                toast.show({ title: 'Annonce supprimée', tone: 'neutral' });
              } else if (mine) {
                withdraw(mine.id);
                toast.show({ title: 'Demande retirée', tone: 'neutral' });
              }
              setConfirm(null);
            }}
          >
            {confirm === 'delete' ? 'Supprimer' : 'Retirer'}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
