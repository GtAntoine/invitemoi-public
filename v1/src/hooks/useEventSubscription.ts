import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useEventSubscription(onUpdate: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('events_changes')
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
}