import { useQuery, QueryResult } from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Event } from '../types/Event';

export function useUser(
  id: number
): QueryResult<Event> & { event: Event | undefined } {
  const client = useAuthenticatedClient<Event>();
  const eventQuery = useQuery(['event', id], async () => {
    return client(`events/${id}`);
  });
  const event = eventQuery.data;
  return {
    event,
    ...eventQuery,
  };
}

export function useAllEvents(): QueryResult<Event[]> & { events: Event[] } {
  const client = useAuthenticatedClient<Event[]>();

  const eventsQuery = useQuery('events', async () => {
    return client('events');
  });

  const events = eventsQuery.data ?? [];

  return {
    events,
    ...eventsQuery,
  };
}
