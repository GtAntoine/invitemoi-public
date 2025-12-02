import { useState, useEffect } from 'react';
import { Event } from '../types/event';

export function useDashboardNotifications(events: Event[]) {
  const [newApplications, setNewApplications] = useState(0);
  const [newAcceptances, setNewAcceptances] = useState(0);

  useEffect(() => {
    // Récupérer le dernier timestamp consulté du localStorage
    const lastChecked = localStorage.getItem('lastDashboardCheck') 
      ? new Date(localStorage.getItem('lastDashboardCheck')!).getTime()
      : 0;

    // Compter les nouvelles candidatures et acceptations
    let applications = 0;
    let acceptances = 0;

    events.forEach(event => {
      // Pour les événements créés par l'utilisateur
      if (event.status === 'open') {
        event.applicants.forEach(app => {
          const appTime = new Date(app.timestamp).getTime();
          if (appTime > lastChecked && app.status === 'pending') {
            applications++;
          }
        });
      }

      // Pour les candidatures de l'utilisateur
      const userApp = event.applicants.find(app => 
        app.status === 'accepted' && 
        new Date(app.timestamp).getTime() > lastChecked
      );
      if (userApp) {
        acceptances++;
      }
    });

    setNewApplications(applications);
    setNewAcceptances(acceptances);
  }, [events]);

  const clearNotifications = () => {
    localStorage.setItem('lastDashboardCheck', new Date().toISOString());
    setNewApplications(0);
    setNewAcceptances(0);
  };

  return {
    newApplications,
    newAcceptances,
    clearNotifications
  };
}