import React, { useState, useMemo } from 'react';
import { EventCategory, EventType, DateFilter } from '../types/event';
import { translations } from '../translations/fr';
import { Filter, Gift, HandHeart, MapPin, Loader2, Calendar } from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';
import { MAJOR_FRENCH_CITIES, getCurrentCity } from '../utils/cityUtils';
import { AddressAutocomplete } from './ui/AddressAutocomplete';
import { addDays, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';

interface EventFiltersProps {
  selectedCategory: EventCategory[] | 'all';
  selectedType: EventType | 'all';
  selectedCity: string | 'all';
  selectedDates: DateFilter[];
  onCategoryChange: (category: EventCategory[] | 'all') => void;
  onTypeChange: (type: EventType | 'all') => void;
  onCityChange: (city: string | 'all') => void;
  onDateChange: (dates: DateFilter[]) => void;
  availableCities: string[];
}

export function EventFilters({ 
  selectedCategory, 
  selectedType,
  selectedCity,
  selectedDates,
  onCategoryChange, 
  onTypeChange,
  onCityChange,
  onDateChange,
  availableCities
}: EventFiltersProps) {
  const [citySearch, setCitySearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [usingLocation, setUsingLocation] = useState(false);
  const { filters, forms } = translations;

  const categories: { value: EventCategory, label: string }[] = [
    { value: 'restaurant', label: forms.categories.restaurant },
    { value: 'theater', label: forms.categories.theater },
    { value: 'museum', label: forms.categories.museum },
    { value: 'cinema', label: forms.categories.cinema },
    { value: 'other', label: forms.categories.other },
  ];

  const types = [
    { value: 'all', label: filters.allTypes },
    { 
      value: 'seeking-host', 
      label: filters.seekingHost,
      icon: Gift,
      colors: {
        selected: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg',
        default: 'bg-primary-50 text-primary-600 hover:bg-primary-100'
      }
    },
    { 
      value: 'offering-host', 
      label: filters.offeringHost,
      icon: HandHeart,
      colors: {
        selected: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg',
        default: 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
      }
    }
  ];

  const handleCategoryClick = (category: EventCategory) => {
    if (selectedCategory === 'all') {
      onCategoryChange([category]);
    } else {
      const isSelected = selectedCategory.includes(category);
      if (isSelected) {
        const newCategories = selectedCategory.filter(c => c !== category);
        onCategoryChange(newCategories.length === 0 ? 'all' : newCategories);
      } else {
        onCategoryChange([...selectedCategory, category]);
      }
    }
  };

  const handleAllCategoriesClick = () => {
    onCategoryChange('all');
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    setUsingLocation(true);
    try {
      const city = await getCurrentCity();
      if (city) {
        onCityChange(city);
        setCitySearch(city);
      }
    } finally {
      setIsLocating(false);
    }
  };

  const handleCitySelect = (address: { label: string; city: string }) => {
    setUsingLocation(false);
    onCityChange(address.city);
    setCitySearch(address.city);
  };

  const handleCityShortcutClick = (city: string | 'all') => {
    setUsingLocation(false);
    if (city === 'all') {
      onCityChange('all');
      setCitySearch('');
    } else {
      onCityChange(city);
      setCitySearch(city);
    }
  };

  const handleDateToggle = (index: number) => {
    const newDates = selectedDates.map((date, i) => 
      i === index ? { ...date, selected: !date.selected } : date
    );
    onDateChange(newDates);
  };

  const handleSelectAllDates = () => {
    const allSelected = selectedDates.every(d => d.selected);
    const newDates = selectedDates.map(date => ({
      ...date,
      selected: !allSelected
    }));
    onDateChange(newDates);
  };

  const formatDate = (date: string) => {
    const d = parseISO(date);
    return {
      day: format(d, 'EEE', { locale: fr }), // Jeu.
      date: format(d, 'd', { locale: fr }), // 21
    };
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-medium text-gray-900">{filters.title}</h2>
      </div>
      
      <div className="space-y-6">
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span>Dates</span>
              </div>
              <button
                onClick={handleSelectAllDates}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-white dark:bg-clip-text"
              >
                {selectedDates.every(d => d.selected) ? 'Désélectionner tout' : 'Sélectionner tout'}
              </button>
            </div>
          </label>
          <div className="flex  gap-1 sm:gap-2
            md:flex flex-wrap md:gap-2">
            {selectedDates.map((dateFilter, index) => {
              const { day, date } = formatDate(dateFilter.date);
              return (
                <button
                  key={dateFilter.date}
                  onClick={() => handleDateToggle(index)}
                  className={clsx(
                    'flex flex-row px-3 items-center justify-center p-2 rounded-full text-sm font-medium transition-all duration-300',
                    'sm:px-4 sm:py-2 rounded-full',
                    dateFilter.selected
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <span className="md:pr-2 text-sm">{day}</span>
                  <span className="text-sm">{date}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filters.categoryLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAllCategoriesClick}
              className={clsx(
                'badge transition-all duration-300',
                selectedCategory === 'all'
                  ? 'badge-gradient'
                  : 'bg-white text-gray-600 hover:bg-gray-200'
              )}
            >
              {filters.allCategories}
            </button>
            {categories.map(({ value, label }) => {
              const CategoryIcon = getCategoryIcon(value);
              return (
                <button
                  key={value}
                  onClick={() => handleCategoryClick(value)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300',
                    selectedCategory !== 'all' && selectedCategory.includes(value)
                      ? 'badge-gradient'
                      : 'bg-white text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <CategoryIcon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filters.typeLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map(({ value, label, icon: Icon, colors }) => (
              <button
                key={value}
                onClick={() => onTypeChange(value as EventType | 'all')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  selectedType === value 
                    ? colors?.selected || 'badge-gradient'
                    : colors?.default || 'bg-white text-gray-600 hover:bg-gray-200'
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filters.cityLabel}
          </label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCityShortcutClick('all')}
                className={clsx(
                  'badge transition-all duration-300',
                  selectedCity === 'all'
                    ? 'badge-gradient'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
                )}
              >
                {filters.allCities}
              </button>
              {MAJOR_FRENCH_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => handleCityShortcutClick(city)}
                  className={clsx(
                    'badge transition-all duration-300',
                    selectedCity === city && !usingLocation
                      ? 'badge-gradient'
                      : 'bg-white text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <AddressAutocomplete
                  value={citySearch}
                  onChange={setCitySearch}
                  onSelect={handleCitySelect}
                  className="w-full"
                />
              </div>
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm	font-sm transition-all duration-300',
                  usingLocation
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
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
          </div>
        </div>
      </div>
    </div>
  );
}