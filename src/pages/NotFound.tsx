import { Ghost } from 'lucide-react';
import { ButtonLink, EmptyState } from '../components/ui/primitives';

export function NotFoundPage({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <EmptyState
      icon={<Ghost className="h-6 w-6" />}
      title="Cette page s’est fait inviter ailleurs"
      body="Le lien est peut-être ancien, ou l’annonce a été supprimée."
      action={<ButtonLink to="/explorer">Retour aux sorties</ButtonLink>}
    />
  );
  if (embedded) return <div className="mx-auto max-w-lg py-10">{content}</div>;
  return <div className="mx-auto grid min-h-dvh max-w-lg place-items-center p-6">{content}</div>;
}
