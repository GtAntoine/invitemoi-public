import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useStats() {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalEvents: 0,
    satisfactionRate: 98
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        // Ne pas exécuter la requête si l'utilisateur n'est pas connecté
        if (!user) {
          setStats({
            activeUsers: 0,
            totalEvents: 0,
            satisfactionRate: 98
          });
          setLoading(false);
          return;
        }

        // Count active users (users who have created events or applied to events)
        const { count: activeUsers, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .or('id.in(select created_by from events),id.in(select user_id from applications)');

        if (usersError) throw usersError;

        // Count total events
        const { count: totalEvents, error: eventsError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });

        if (eventsError) throw eventsError;

        if (isMounted) {
          setStats({
            activeUsers: activeUsers || 0,
            totalEvents: totalEvents || 0,
            satisfactionRate: 98
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { stats, loading, error };
}