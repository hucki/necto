import dayjs, { Dayjs } from 'dayjs';
import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Event } from '../types/Event';

export function useEvent(
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

export function useDeleteEvent(): MutationResultPair<
  { message: string },
  Error,
  { id: number },
  string
  > {
  const client = useAuthenticatedClient<{ message: string }>();

  const deleteEvent = async ({
    id,
  }: {
    id: number;
  }): Promise<{ message: string }> => {
    return client(`events/${id}`, { method: 'DELETE' });
  };

  return useMutation(deleteEvent, {
    onSuccess: () => {
      queryCache.invalidateQueries('events');
    },
  });
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

export function useWeeksEvents(
  year: number,
  week: number
): QueryResult<Event[]> & { rawEvents: Event[] } {
  const client = useAuthenticatedClient<Event[]>();

  const eventsQuery = useQuery(['events', year, week], async () => {
    return client(`events/w/${year}/${week}`);
  });

  const rawEvents = eventsQuery.data ?? [];
  return {
    rawEvents,
    ...eventsQuery,
  };
}

export function useDaysEvents(
  currentDate: Dayjs
): QueryResult<Event[]> & { rawEvents: Event[] } {
  const client = useAuthenticatedClient<Event[]>();
  const year = dayjs(currentDate).format('YYYY');
  const month = dayjs(currentDate).format('MM');
  const day = dayjs(currentDate).format('DD');
  const eventsDayQuery = useQuery(['events', currentDate], async () => {
    return client(`events/d/${year}/${month}/${day}`);
  });

  const rawEvents = eventsDayQuery.data ?? [];
  return {
    rawEvents,
    ...eventsDayQuery,
  };
}

export function useCreateEvent(): MutationResultPair<
  Event,
  Error,
  { event: Event },
  string
  > {
  const client = useAuthenticatedClient<Event>();
  const createEvent = async ({ event }: { event: Event }): Promise<Event> => {
    return client('events', { data: event });
  };
  return useMutation(createEvent, {
    onSuccess: () => {
      queryCache.invalidateQueries('events');
    },
  });
}
