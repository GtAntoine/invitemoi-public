import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { formatAddress } from '../../utils/addressUtils';
import clsx from 'clsx';

interface Address {
  label: string;
  city: string;
  lat: number;
  lon: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: { label: string; city: string }) => void;
  required?: boolean;
  className?: string;
}

export function AddressAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  required,
  className 
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr'
          }
        }
      );
      const data = await response.json();

      const addresses: Address[] = data.map((item: any) => ({
        label: formatAddress(item), // Utiliser notre fonction de formatage
        city: item.address.city || item.address.town || item.address.village || '',
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }));

      setSuggestions(addresses);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (address: Address) => {
    onChange(address.label);
    onSelect({
      label: address.label,
      city: address.city
    });
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          required={required}
          className={clsx(
            "w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300",
            "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "transition-all duration-300",
            className
          )}
          placeholder="Saisissez une adresse..."
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg 
                      shadow-lg max-h-60 overflow-auto">
          {suggestions.map((address, index) => (
            <button
              key={index}
              onClick={() => handleSelect(address)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">{address.label}</div>
              {address.city && (
                <div className="text-sm text-gray-500">{address.city}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
