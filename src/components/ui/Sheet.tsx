import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Feuille qui monte du bas sur mobile, fenêtre centrée sur grand écran. */
export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null);
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => panel.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6">
          <motion.div
            className="absolute inset-0 bg-[#14110E]/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
            className={clsx(
              'relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-surface pb-safe shadow-lift outline-none',
              'md:max-w-lg md:rounded-[28px] md:pb-0',
              className,
            )}
          >
            <div
              className="sticky top-0 z-10 touch-none bg-surface/95 px-5 pb-2 pt-3 backdrop-blur md:pt-5"
              onPointerDown={(e) => drag.start(e)}
            >
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line md:hidden" />
              <div className="flex items-center justify-between gap-4">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                <button
                  onClick={onClose}
                  aria-label="Fermer"
                  className="-mr-2 ml-auto grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-sunken"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
