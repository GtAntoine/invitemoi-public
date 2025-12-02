import React from 'react';
import { Calendar } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';

interface DateSelectorProps {
  selectedDate: string | null;
  onChange: (date: string) => void;
  className?: string;
}

export function DateSelector({ selectedDate, onChange, className }: DateSelectorProps) {
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: {
        day: format(date, 'EEE', { locale: fr }),
        date: format(date, 'd', { locale: fr }),
        month: format(date, 'MMM', { locale: fr })
      }
    };
  });

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-900 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>Date</span>
        </div>
      </label>
      <div className="flex flex-wrap gap-2">
        {dates.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={clsx(
              'flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
              selectedDate === value
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <span className="uppercase text-xs">{label.day}</span>
            <span className="text-base font-bold">{label.date}</span>
            <span className="uppercase text-xs">{label.month}</span>
          </button>
        ))}
      </div>
    </div>
  );
}