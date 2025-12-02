import { Event, Application } from '../types/event';
import { startOfDay, isToday } from 'date-fns';

const MAX_ACTIVE_EVENTS = 5;
const MAX_DAILY_APPLICATIONS = 5;
const MAX_APPLICATIONS_PER_EVENT = 20;

export function canCreateEvent(userEvents: Event[]): { allowed: boolean; reason?: string } {
  const activeEvents = userEvents.filter(event => event.status === 'open');
  
  if (activeEvents.length >= MAX_ACTIVE_EVENTS) {
    return {
      allowed: false,
      reason: `Vous ne pouvez pas avoir plus de ${MAX_ACTIVE_EVENTS} événements actifs simultanément.`
    };
  }

  return { allowed: true };
}

export function canApplyToEvent(
  event: Event,
  userApplications: Application[]
): { allowed: boolean; reason?: string } {
  // Vérifier la limite quotidienne
  const todayApplications = userApplications.filter(app => 
    isToday(new Date(app.timestamp))
  );

  if (todayApplications.length >= MAX_DAILY_APPLICATIONS) {
    return {
      allowed: false,
      reason: `Vous ne pouvez pas candidater à plus de ${MAX_DAILY_APPLICATIONS} événements par jour.`
    };
  }

  // Vérifier la limite par événement
  if (event.applicants.length >= MAX_APPLICATIONS_PER_EVENT) {
    return {
      allowed: false,
      reason: `Cet événement a atteint sa limite de ${MAX_APPLICATIONS_PER_EVENT} candidatures.`
    };
  }

  return { allowed: true };
}