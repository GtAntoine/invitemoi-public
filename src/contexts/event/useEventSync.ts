// src/contexts/event/useEventSync.ts
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function useEventSync(onUpdate: () => void) {
  useEffect(() => {
    // S'abonner aux changements de la table events et applications
    const channel = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    // Cleanup: se désabonner quand le composant est démonté
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
}
