import React, { useState, useRef, useEffect } from 'react';
import { X, Globe2 } from 'lucide-react';
import { translations } from '../../translations/fr';
import { COMMON_FRENCH_LANGUAGES, getLanguageSuggestions } from '../../utils/languageUtils';
import clsx from 'clsx';

interface LanguagesSelectorProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

export function LanguagesSelector({ selectedLanguages, onLanguagesChange }: LanguagesSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { profile: t } = translations;
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = getLanguageSuggestions(searchTerm, selectedLanguages);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddLanguage = (language: string) => {
    onLanguagesChange([...selectedLanguages, language]);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveLanguage = (language: string) => {
    onLanguagesChange(selectedLanguages.filter(l => l !== language));
  };

  return (
    <div className="space-y-4">
      {/* Langues sélectionnées */}
      <div className="flex flex-wrap gap-2">
        {selectedLanguages.map(language => (
          <span
            key={language}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-800 
                     rounded-full text-sm font-medium group"
          >
            {language}
            <button
              onClick={() => handleRemoveLanguage(language)}
              className="p-0.5 hover:bg-primary-200 rounded-full opacity-50 
                       group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Champ de recherche */}
      <div className="relative" ref={containerRef}>
        <div className="flex items-center gap-2 mb-2">
          <Globe2 className="w-4 h-4 text-primary-500" />
          <label className="text-sm font-medium text-gray-700">
            Ajouter une langue
          </label>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Rechercher une langue..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500"
        />

        {/* Suggestions */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg 
                        shadow-lg max-h-60 overflow-auto">
            {/* Langues communes en haut si pas de recherche */}
            {!searchTerm && (
              <div className="p-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">Langues courantes</p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_FRENCH_LANGUAGES
                    .filter(lang => !selectedLanguages.includes(lang.name))
                    .map(lang => (
                      <button
                        key={lang.name}
                        onClick={() => handleAddLanguage(lang.name)}
                        className="px-2 py-1 text-sm bg-white hover:bg-gray-100 
                                 rounded border border-gray-200 transition-colors"
                      >
                        {lang.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Liste des suggestions */}
            <div className="max-h-40 overflow-y-auto">
              {suggestions.map(lang => (
                <button
                  key={lang.name}
                  onClick={() => handleAddLanguage(lang.name)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Sélectionnez les langues que vous parlez. Vous pouvez en ajouter plusieurs.
      </p>
    </div>
  );
}
