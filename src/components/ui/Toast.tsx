import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

type Tone = 'info' | 'success' | 'neutral';

interface ToastInput {
  title: string;
  body?: string;
  tone?: Tone;
  href?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: number;
}

const ToastContext = createContext<{ show: (t: ToastInput) => void } | null>(null);

const icons = { info: Bell, success: Check, neutral: Info };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const navigate = useNavigate();

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback(
    (t: ToastInput) => {
      const id = ++counter.current;
      setItems((list) => [...list.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), t.duration ?? 5000);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6 md:top-auto md:items-end"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const Icon = icons[t.tone ?? 'neutral'];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-2 shadow-lift"
              >
                <span
                  className={clsx(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-full',
                    t.tone === 'success' && 'bg-success-soft text-success',
                    t.tone === 'info' && 'bg-coral-soft text-coral',
                    (!t.tone || t.tone === 'neutral') && 'bg-sunken text-muted',
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{t.title}</p>
                  {t.body && <p className="truncate text-xs text-muted">{t.body}</p>}
                </div>
                {(t.href || t.onAction) && (
                  <button
                    onClick={() => {
                      t.onAction?.();
                      if (t.href) navigate(t.href);
                      dismiss(t.id);
                    }}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold text-coral hover:bg-coral-soft"
                  >
                    {t.actionLabel ?? 'Voir'}
                  </button>
                )}
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Fermer"
                  className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-sunken"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast doit être utilisé dans <ToastProvider>');
  return ctx;
}
