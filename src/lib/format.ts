import { differenceInCalendarDays, format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function dayLabel(date: string) {
  const d = parseISO(date);
  const diff = differenceInCalendarDays(d, new Date());
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Demain';
  return capitalize(format(d, 'EEEE d MMMM', { locale: fr }));
}

export function shortDay(date: string) {
  const d = parseISO(date);
  const diff = differenceInCalendarDays(d, new Date());
  if (diff === 0) return { top: 'Auj.', bottom: format(d, 'd') };
  if (diff === 1) return { top: 'Dem.', bottom: format(d, 'd') };
  return { top: capitalize(format(d, 'EEE', { locale: fr }).replace('.', '')), bottom: format(d, 'd') };
}

export function stamp(date: string) {
  const d = parseISO(date);
  return { weekday: format(d, 'EEE', { locale: fr }).replace('.', '').toUpperCase(), day: format(d, 'd'), month: format(d, 'MMM', { locale: fr }).replace('.', '') };
}

export function timeLabel(time: string) {
  const [h, m] = time.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

export function relative(iso: string) {
  const distance = formatDistanceToNowStrict(parseISO(iso), { locale: fr });
  return distance.startsWith('0 ') ? "à l'instant" : `il y a ${distance}`;
}

export function memberSince(iso: string) {
  return format(parseISO(iso), 'MMMM yyyy', { locale: fr });
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function plural(n: number, one: string, many: string) {
  return `${n} ${n > 1 ? many : one}`;
}
