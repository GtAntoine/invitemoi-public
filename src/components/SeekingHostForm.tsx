import React, { useState } from 'react';
import { Type, HandHeart } from 'lucide-react';
import { EventCategory } from '../types/event';
import { translations } from '../translations/fr';
import { AddressAutocomplete } from './ui/AddressAutocomplete';
import { DateSelector } from './ui/DateSelector';
import { TimeSelector } from './ui/TimeSelector';

interface SeekingHostFormProps {
  onSubmit: (eventData: {
    title: string;
    description: string;
    category: EventCategory;
    date: string;
    time: string;
    location: string;
    eventType: 'seeking-host';
    city: string;
  }) => void;
  onCancel: () => void;
  error?: string | null;
  loading?: boolean;
}

export function SeekingHostForm({ onSubmit, onCancel, error, loading }: SeekingHostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'restaurant' as EventCategory,
    date: '',
    time: '',
    location: '',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      ...formData,
      eventType: 'seeking-host' 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address: { label: string; city: string }) => {
    setFormData(prev => ({ 
      ...prev, 
      location: address.label,
      city: address.city
    }));
  };

  const { forms } = translations;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg 
                                             hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 pb-4 border-b border-primary-100">
          <div className="p-3 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
            <HandHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-800
                          bg-clip-text text-transparent dark:text-white dark:bg-clip-text">
              Je me fais inviter
            </h2>
            <p className="text-secondary-600 dark:text-white dark:bg-clip-text">Créez un événement et trouvez quelqu'un pour vous inviter</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <div className="flex items-center gap-2">
              <span>{forms.common.title}</span>
            </div>
          </label>
          <input
            type="text"
            name="title"
            maxLength="100"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">{forms.common.category}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          >
            <option value="restaurant">{forms.categories.restaurant}</option>
            <option value="theater">{forms.categories.theater}</option>
            <option value="museum">{forms.categories.museum}</option>
            <option value="cinema">{forms.categories.cinema}</option>
            <option value="other">{forms.categories.other}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">{forms.common.description}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            maxLength="1000"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateSelector
            selectedDate={formData.date}
            onChange={(date) => setFormData(prev => ({ ...prev, date }))}
          />

          <TimeSelector
            value={formData.time}
            onChange={(time) => setFormData(prev => ({ ...prev, time }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {forms.common.location}
          </label>
          <AddressAutocomplete
            value={formData.location}
            onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            onSelect={handleAddressSelect}
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={!formData.date || !formData.time || loading}
            className="flex-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-6 
                     rounded-full font-medium shadow-lg hover:from-primary-600 hover:to-primary-700 
                     transform hover:scale-105 transition-all duration-300 focus:outline-none 
                     focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50
                     disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Création...' : forms.common.submit}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-medium 
                     hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {forms.common.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}