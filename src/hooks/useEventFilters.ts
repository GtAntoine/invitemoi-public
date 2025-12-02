import { useState, useEffect } from 'react';
import { EventCategory, EventType, DateFilter } from '../types/event';
import { getStoredFilters, saveFilters } from '../utils/filterStorage';
import { generateDateFilters } from '../utils/dateUtils';

export function useEventFilters() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory[] | 'all'>(() => {
    const stored = getStoredFilters();
    return stored?.category || 'all';
  });

  const [selectedType, setSelectedType] = useState<EventType | 'all'>(() => {
    const stored = getStoredFilters();
    return stored?.type || 'all';
  });

  const [selectedCity, setSelectedCity] = useState<string | 'all'>(() => {
    const stored = getStoredFilters();
    return stored?.city || 'all';
  });

  const [selectedDates, setSelectedDates] = useState<DateFilter[]>(() => {
    const stored = getStoredFilters();
    // Toujours générer de nouvelles dates, mais conserver les sélections si possible
    const newDates = generateDateFilters();
    if (stored?.dates) {
      // Appliquer les sélections stockées aux nouvelles dates si elles existent encore
      return newDates.map(date => ({
        ...date,
        selected: stored.dates.find(d => d.date === date.date)?.selected ?? true
      }));
    }
    return newDates;
  });

  // Sauvegarder les filtres quand ils changent
  useEffect(() => {
    saveFilters({
      category: selectedCategory,
      type: selectedType,
      city: selectedCity,
      dates: selectedDates
    });
  }, [selectedCategory, selectedType, selectedCity, selectedDates]);

  return {
    selectedCategory,
    selectedType,
    selectedCity,
    selectedDates,
    setSelectedCategory,
    setSelectedType,
    setSelectedCity,
    setSelectedDates
  };
}