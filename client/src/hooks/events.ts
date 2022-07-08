import dayjs, { Dayjs } from 'dayjs';
import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { client } from '../services/ApiClient';
import { CancellationReason, Event } from '../types/Event';

export function useEvent(
  id: number
): QueryResult<Event> & { event: Event | undefined } {
  const eventQuery = useQuery(['event', id], async () => {
    return client<Event>(`events/${id}`);
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
  { uuid: string },
  string
  > {
  const deleteEvent = async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<{ message: string }> => {
    return client<{ message: string }>(`events/${uuid}`, { method: 'DELETE' });
  };

  return useMutation(deleteEvent, {
    onSuccess: () => {
      queryCache.invalidateQueries('events');
    },
  });
}

export function useAllEvents(): QueryResult<Event[]> & { events: Event[] } {
  const eventsQuery = useQuery('events', async () => {
    return client<Event[]>('events');
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
  const eventsQuery = useQuery(['events', year, week], async () => {
    return client<Event[]>(`events/w/${year}/${week}`);
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
  const year = dayjs(currentDate).format('YYYY');
  const month = dayjs(currentDate).format('MM');
  const day = dayjs(currentDate).format('DD');
  const eventsDayQuery = useQuery(['events', currentDate], async () => {
    return client<Event[]>(`events/d/${year}/${month}/${day}`);
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
  const createEvent = async ({ event }: { event: Event }): Promise<Event> => {
    return client<Event>('events', { data: event });
  };
  return useMutation(createEvent, {
    onSuccess: () => {
      queryCache.invalidateQueries('events');
    },
  });
}

export function useUpdateEvent(): MutationResultPair<
  Event,
  Error,
  { event: Event },
  string
  > {
  const updateEvent = async ({ event }: { event: Event }): Promise<Event> => {
    return client<Event>(`events/${event.uuid}`, { data: event, method: 'PATCH' });
  };
  return useMutation(updateEvent, {
    onSuccess: () => {
      queryCache.invalidateQueries('events');
    },
  });
}

const cancellationReasonsRoute = 'settings/event/cr';

export function useCreateCancellationReason(): MutationResultPair<
  CancellationReason,
  Error,
  { cr: CancellationReason },
  string
  > {
  const createCancellationReason = async ({ cr }: { cr: CancellationReason }): Promise<CancellationReason> => {
    return client<CancellationReason>(cancellationReasonsRoute, { data: cr });
  };
  return useMutation(createCancellationReason, {
    onSuccess: () => {
      queryCache.invalidateQueries(cancellationReasonsRoute);
    },
  });
}

export function useUpdateCancellationReason(): MutationResultPair<
CancellationReason,
  Error,
  { cr: CancellationReason },
  string
  > {
  const updateCancellationReason = async ({ cr }: { cr: CancellationReason }): Promise<CancellationReason> => {
    return client<CancellationReason>(cancellationReasonsRoute, { data: cr, method: 'PATCH' });
  };
  return useMutation(updateCancellationReason, {
    onSuccess: () => {
      queryCache.invalidateQueries(cancellationReasonsRoute);
    },
  });
}

export function useAllCancellationReasons(): QueryResult<CancellationReason[]> & { cancellationReasons: CancellationReason[] } {
  const usersQuery = useQuery(cancellationReasonsRoute, async () => {
    return client<CancellationReason[]>(cancellationReasonsRoute);
  });

  const cancellationReasons = usersQuery.data ?? [];

  return {
    cancellationReasons,
    ...usersQuery,
  };
}