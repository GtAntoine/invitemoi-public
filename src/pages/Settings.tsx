import { useNavigate } from 'react-router-dom';
import { LogOut, Monitor, Moon, RotateCcw, Sun } from 'lucide-react';
import clsx from 'clsx';
import { useDemo } from '../lib/store';
import { useTheme, type ThemeChoice } from '../lib/theme';
import { Button } from '../components/ui/primitives';
import { useToast } from '../components/ui/Toast';

const THEMES: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Clair', icon: Sun },
  { value: 'dark', label: 'Sombre', icon: Moon },
  { value: 'system', label: 'Auto', icon: Monitor },
];

export function SettingsPage() {
  const { choice, setChoice } = useTheme();
  const { reset, signOut } = useDemo();
  const toast = useToast();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold md:text-4xl">Réglages</h1>

      <section className="rounded-[28px] border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold">Apparence</h2>
        <div role="radiogroup" className="mt-4 grid grid-cols-3 gap-2">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              role="radio"
              aria-checked={choice === value}
              onClick={() => setChoice(value)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-2xl border-2 py-4 text-sm font-semibold transition-colors',
                choice === value ? 'border-ink' : 'border-transparent bg-sunken hover:border-line',
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-dashed border-line p-6">
        <h2 className="text-lg font-semibold">À propos de cette démo</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Tout se passe dans ton navigateur : aucune donnée n’est envoyée. Les autres membres sont fictifs et réagissent automatiquement à tes
          actions, pour que tu puisses parcourir l’expérience de bout en bout.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              toast.show({ title: 'Démo réinitialisée', body: 'Les annonces et candidatures de départ sont de retour.', tone: 'success' });
              navigate('/explorer');
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser la démo
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              signOut();
              navigate('/');
            }}
          >
            <LogOut className="h-4 w-4" />
            Quitter la démo
          </Button>
        </div>
      </section>
    </div>
  );
}
