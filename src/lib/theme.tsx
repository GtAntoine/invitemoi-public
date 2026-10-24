import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';
const KEY = 'invitemoi-theme';

const ThemeContext = createContext<{ choice: ThemeChoice; setChoice: (c: ThemeChoice) => void } | null>(null);

function read(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    // ignoré
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<ThemeChoice>(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      // ignoré
    }
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = choice === 'dark' || (choice === 'system' && media.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [choice]);

  return <ThemeContext.Provider value={{ choice, setChoice }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans <ThemeProvider>');
  return ctx;
}
