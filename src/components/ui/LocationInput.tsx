import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { getCurrentCity } from '../../utils/cityUtils';
import clsx from 'clsx';

interface LocationSuggestion {
  city: string;
  postcode: string;
  label: string;
}

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export function LocationInput({ 
  value, 
  onChange, 
  required,
  className 
}: LocationInputProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=5`
      );
      const data = await response.json();
      
      const formattedSuggestions: LocationSuggestion[] = data.features.map((feature: any) => ({
        city: feature.properties.city,
        postcode: feature.properties.postcode,
        label: `${feature.properties.city} (${feature.properties.postcode})`
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.label);
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const city = await getCurrentCity();
      if (city) {
        onChange(city);
      }
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => value.length >= 3 && setShowSuggestions(true)}
            required={required}
            className={clsx(
              "w-full px-4 py-2.5 rounded-lg border border-gray-300",
              "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "transition-all duration-300",
              className
            )}
            placeholder="Ex: Paris, France"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
            "transition-all duration-300",
            value ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200' :
            'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
          )}
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          Ma position
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 
                      dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
                       transition-colors text-gray-900 dark:text-gray-100"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
