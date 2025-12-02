import React from 'react';
import { EventType } from '../types/event';
import { UserPlus, Users } from 'lucide-react';
import clsx from 'clsx';

interface EventTypeSelectorProps {
  selectedType: EventType;
  onSelect: (type: EventType) => void;
}

export function EventTypeSelector({ selectedType, onSelect }: EventTypeSelectorProps) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onSelect('seeking-host')}
        className={clsx(
          'flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2',
          selectedType === 'seeking-host'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-200'
        )}
      >
        <UserPlus className="w-6 h-6" />
        <span className="font-medium">Looking for Host</span>
        <span className="text-sm text-gray-500">Get invited by someone</span>
      </button>

      <button
        onClick={() => onSelect('offering-host')}
        className={clsx(
          'flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2',
          selectedType === 'offering-host'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-200'
        )}
      >
        <Users className="w-6 h-6" />
        <span className="font-medium">Offering to Host</span>
        <span className="text-sm text-gray-500">Invite and treat someone</span>
      </button>
    </div>
  );
}