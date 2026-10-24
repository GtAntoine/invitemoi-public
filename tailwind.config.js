/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        sunken: token('sunken'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        coral: { DEFAULT: token('coral'), soft: token('coral-soft'), ink: token('coral-ink') },
        saffron: { DEFAULT: token('saffron'), soft: token('saffron-soft'), ink: token('saffron-ink') },
        success: { DEFAULT: token('success'), soft: token('success-soft') },
        danger: { DEFAULT: token('danger'), soft: token('danger-soft') },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(var(--shadow) / 0.06), 0 8px 24px -12px rgb(var(--shadow) / 0.18)',
        lift: '0 2px 4px rgb(var(--shadow) / 0.08), 0 24px 48px -16px rgb(var(--shadow) / 0.28)',
      },
    },
  },
  plugins: [],
};
