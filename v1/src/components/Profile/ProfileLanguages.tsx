import React from 'react';
import { Globe2 } from 'lucide-react';
import { translations } from '../../translations/fr';

interface ProfileLanguagesProps {
  languages: string[];
}

export function ProfileLanguages({ languages }: ProfileLanguagesProps) {
  const { profile: t } = translations;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5" />
          <span>{t.languages}</span>
        </div>
      </h2>
      <div className="flex flex-wrap gap-2">
        {languages.map((language, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {language}
          </span>
        ))}
      </div>
    </div>
  );
}