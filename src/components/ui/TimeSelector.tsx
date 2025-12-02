import React from 'react';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

export function TimeSelector({ value, onChange, className }: TimeSelectorProps) {
  // Generate time slots every 30 minutes from 09:00 to 23:30
  const timeSlots = [];
  for (let hour = 9; hour <= 23; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-900 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-500" />
          <span>Heure</span>
        </div>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
      >
        <option value="">Sélectionnez une heure</option>
        {timeSlots.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}