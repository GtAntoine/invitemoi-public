import React, { useMemo } from 'react';
import { Event, EventCategory, EventType, DateFilter } from '../types/event';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { SeekingHostForm } from './SeekingHostForm';
import { OfferingHostForm } from './OfferingHostForm';
import { translations } from '../translations/fr';
import { useEventFilters } from '../hooks/useEventFilters';
import { motion, AnimatePresence } from 'framer-motion';

interface EventListProps {
  events: Event[];
  onApply: (eventId: string) => void;
  onViewProfile: (userId: string) => void;
  showingForms: boolean;
  showSeekingHostForm?: boolean;
  showOfferingHostForm?: boolean;
  onCreateEvent: (eventData: any) => void;
  onCancelForm: () => void;
  currentUserId?: string;
}

export function EventList({ 
  events, 
  onApply,
  onViewProfile,
  showingForms,
  showSeekingHostForm,
  showOfferingHostForm,
  onCreateEvent,
  onCancelForm,
  currentUserId
}: EventListProps) {
  const {
    selectedCategory,
    selectedType,
    selectedCity,
    selectedDates,
    setSelectedCategory,
    setSelectedType,
    setSelectedCity,
    setSelectedDates
  } = useEventFilters();

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    events.forEach(event => {
      if (event.city) {
        cities.add(event.city);
      }
    });
    return Array.from(cities).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = selectedCategory === 'all' || selectedCategory.includes(event.category);
      const matchesType = selectedType === 'all' || event.eventType === selectedType;
      const matchesCity = selectedCity === 'all' || event.city === selectedCity;
      const matchesDate = selectedDates.some(d => d.date === event.date && d.selected);

      return matchesCategory && matchesType && matchesCity && matchesDate;
    });
  }, [events, selectedCategory, selectedType, selectedCity, selectedDates]);

  if (showSeekingHostForm) {
    return (
      <SeekingHostForm
        onSubmit={onCreateEvent}
        onCancel={onCancelForm}
      />
    );
  }

  if (showOfferingHostForm) {
    return (
      <OfferingHostForm
        onSubmit={onCreateEvent}
        onCancel={onCancelForm}
      />
    );
  }

  if (events.length === 0 && !showingForms) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {translations.events.empty}
        </p>
      </div>
    );
  }

  return (
    <div>
      {!showingForms && (
        <EventFilters
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          selectedCity={selectedCity}
          selectedDates={selectedDates}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
          onCityChange={setSelectedCity}
          onDateChange={setSelectedDates}
          availableCities={availableCities}
        />
      )}

      {filteredEvents.length > 0 ? (
        <div className="pt-3 columns-1 md:columns-2 lg:columns-3 gap-3 md:gap-6 [column-fill:_balance]">
          <AnimatePresence>
            {filteredEvents.map(event => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                  layout: { duration: 0.2 }
                }}
                className="break-inside-avoid mb-3 md:mb-6"
              >
                <EventCard
                  event={event}
                  onApply={onApply}
                  onViewProfile={onViewProfile}
                  currentUserId={currentUserId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {translations.events.noResults}
          </p>
        </div>
      )}
    </div>
  );
}