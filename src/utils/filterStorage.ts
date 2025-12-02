import { EventCategory, EventType, DateFilter } from '../types/event';

interface StoredFilters {
  category: EventCategory[] | 'all';
  type: EventType | 'all';
  city: string | 'all';
  dates: DateFilter[];
}

const STORAGE_KEY = 'event_filters';

export function saveFilters(filters: StoredFilters): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

export function getStoredFilters(): StoredFilters | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading filters:', error);
    return null;
  }
}

export function clearStoredFilters(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing filters:', error);
  }
}