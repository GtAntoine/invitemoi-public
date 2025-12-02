export const COMMON_FRENCH_LANGUAGES = [
  {
    name: 'Français',
    level: 'native',
    common: true
  },
  {
    name: 'Anglais',
    level: 'international',
    common: true
  },
  {
    name: 'Espagnol',
    level: 'common',
    common: true
  },
  {
    name: 'Allemand',
    level: 'common',
    common: true
  },
  {
    name: 'Italien',
    level: 'common',
    common: true
  },
  {
    name: 'Portugais',
    level: 'common',
    common: true
  },
  {
    name: 'Arabe',
    level: 'common',
    common: true
  }
];

export const ALL_LANGUAGES = [
  ...COMMON_FRENCH_LANGUAGES,
  { name: 'Russe', level: 'other', common: false },
  { name: 'Chinois', level: 'other', common: false },
  { name: 'Japonais', level: 'other', common: false },
  { name: 'Hindi', level: 'other', common: false },
  { name: 'Coréen', level: 'other', common: false },
  { name: 'Néerlandais', level: 'other', common: false },
  { name: 'Suédois', level: 'other', common: false },
  { name: 'Grec', level: 'other', common: false },
  { name: 'Latin', level: 'other', common: false }
].sort((a, b) => a.name.localeCompare(b.name));

export function getLanguageSuggestions(searchTerm: string, selectedLanguages: string[]) {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return ALL_LANGUAGES
    .filter(lang => 
      !selectedLanguages.includes(lang.name) &&
      lang.name.toLowerCase().includes(normalizedSearch)
    )
    .sort((a, b) => {
      // Mettre en premier les langues communes si la recherche est vide
      if (!normalizedSearch && a.common !== b.common) {
        return a.common ? -1 : 1;
      }
      return 0;
    });
}
