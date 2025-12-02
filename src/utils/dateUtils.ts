import { addDays, differenceInYears, format, isBefore, parseISO, startOfDay } from 'date-fns';
import { DateFilter } from '../types/event';

export function getDateLimits() {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 1);
  
  return {
    min: format(today, 'yyyy-MM-dd'),
    max: format(maxDate, 'yyyy-MM-dd')
  };
}

export function generateDateFilters(): DateFilter[] {
  const dates: DateFilter[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    dates.push({
      date: format(date, 'yyyy-MM-dd'),
      selected: true
    });
  }
  
  return dates;
}

export function isValidEventDate(date: string): boolean {
  const eventDate = parseISO(date);
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 1);
  
  return !isBefore(eventDate, today) && !isBefore(maxDate, eventDate);
}

export function isPastEvent(date: string, time: string): boolean {
  const eventDateTime = parseISO(`${date}T${time}`);
  return isBefore(eventDateTime, new Date());
}

export function calculateAge(birthDate: string): number {
  return differenceInYears(new Date(), parseISO(birthDate));
}