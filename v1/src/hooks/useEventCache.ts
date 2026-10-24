import { useEffect, useState } from 'react';
import { Event } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { useEventContext } from '../contexts/event/EventContext';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const eventCache = new Map<string, { data: Event; timestamp: number }>();

export function useEventCache(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const events = useEventStore(state => state.events);

  useEffect(() => {
    const fetchEvent = async () => {
      // Check cache first
      const cached = eventCache.get(eventId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setEvent(cached.data);
        setLoading(false);
        return;
      }

      // Check store
      const storeEvent = events.find(e => e.id === eventId);
      if (storeEvent) {
        eventCache.set(eventId, {
          data: storeEvent,
          timestamp: Date.now()
        });
        setEvent(storeEvent);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [eventId, events]);

  return { event, loading };
}