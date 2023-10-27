import dayjs, { Dayjs } from 'dayjs';
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import {
  CancellationReason,
  CancellationReasonCreate,
  Event,
  LeaveStatus,
  NewEvent,
} from '../types/Event';
import { Employee } from '../types/Employee';
import { EventAPIResponse } from '../types/Api';
import { Room } from '../types/Rooms';
import { Patient } from '../types/Patient';

export function useEvent(
  id: number
): UseQueryResult<Event> & { event: Event | undefined } {
  const eventQuery = useQuery(['event', id], async () => {
    return client<Event>(`events/${id}`);
  });
  const event = eventQuery.data;
  return {
    event,
    ...eventQuery,
  };
}

export function useDeleteEvent(): UseMutationResult<
  { message: string },
  Error,
  { uuid: string },
  string
> {
  const queryClient = useQueryClient();
  const deleteEvent = async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<{ message: string }> => {
    return client<{ message: string }>(`events/${uuid}`, { method: 'DELETE' });
  };

  return useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useDeleteEventWithChildren(): UseMutationResult<
  { message: string },
  Error,
  { uuid: string },
  string
> {
  const queryClient = useQueryClient();
  const deleteEventWithChildren = async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<{ message: string }> => {
    return client<{ message: string }>(`events/c/${uuid}`, {
      method: 'DELETE',
    });
  };

  return useMutation(deleteEventWithChildren, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useDeleteCurrentAndFutureEvents(): UseMutationResult<
  { message: string },
  Error,
  { uuid: string },
  string
> {
  const queryClient = useQueryClient();
  const deleteCurrentAndFutureEvents = async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<{ message: string }> => {
    return client<{ message: string }>(`events/cf/${uuid}`, {
      method: 'DELETE',
    });
  };

  return useMutation(deleteCurrentAndFutureEvents, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
}

type BaseEventProps = {
  employeeId?: Employee['uuid'];
  roomId?: Room['uuid'] | 'IS NOT NULL';
  includes?: string;
};
type PatientInput = {
  patientId: Patient['uuid'];
  isDiagnostic?: Event['isDiagnostic'];
  year?: never;
  month?: never;
  week?: never;
  date?: never;
};
type MonthInput = {
  patientId?: never;
  isDiagnostic?: never;
  year: number;
  month: number;
  week?: never;
  date?: never;
};
type WeekInput = {
  patientId?: never;
  isDiagnostic?: never;
  year: number;
  week: number;
  month?: never;
  date?: never;
};
type DateInput = {
  patientId?: never;
  isDiagnostic?: never;
  date: Dayjs;
  year?: never;
  week?: never;
  month?: never;
};

/**
 * universal V2 JSON API event getter
 */
export function useEvents({
  year,
  employeeId,
  patientId,
  isDiagnostic,
  month,
  week,
  date,
  roomId,
  includes,
}: BaseEventProps &
  (
    | MonthInput
    | WeekInput
    | DateInput
    | PatientInput
  )): UseQueryResult<EventAPIResponse> & {
  rawEvents: Event[];
} {
  const queryDate = date
    ? dayjs(date).format('YYYY') +
      '-' +
      dayjs(date).format('MM') +
      '-' +
      dayjs(date).format('DD')
    : undefined;

  const filterParameter = [
    'employeeId',
    'year',
    'week',
    'month',
    'date',
    'roomId',
    'patientId',
    'isDiagnostic',
  ] as const;
  type FilterParameter = (typeof filterParameter)[number];
  type QueryParams = {
    [key in FilterParameter as `filter[${key}]`]?: string;
  } & {
    includes?: string;
  };

  const queryParams: QueryParams = { includes };
  if (employeeId) queryParams['filter[employeeId]'] = employeeId;
  if (patientId) queryParams['filter[patientId]'] = patientId;
  if (isDiagnostic)
    queryParams['filter[isDiagnostic]'] = isDiagnostic.toString();
  if (year) queryParams['filter[year]'] = year.toString();
  if (week) queryParams['filter[week]'] = week.toString();
  if (month) queryParams['filter[month]'] = month.toString();
  if (date) queryParams['filter[date]'] = queryDate;
  if (roomId) queryParams['filter[roomId]'] = roomId.toString();

  console.log(queryParams);
  const eventsQuery = useQuery(
    ['events', year, week, date, patientId],
    async () => {
      return client<EventAPIResponse>('v2/events', {
        queryParams,
      });
    }
  );

  const rawEvents = eventsQuery.data?.data.map((e) => e.attributes) ?? [];
  return {
    rawEvents,
    ...eventsQuery,
  };
}

export function useWeeksRoomsFromEvents(
  year: number,
  week: number
): UseQueryResult<Event[]> & { rawEvents: Event[] } {
  const eventsQuery = useQuery(['events/rooms', year, week], async () => {
    return client<Event[]>(`events/r/${year}/${week}`);
  });

  const rawEvents = eventsQuery.data ?? [];
  return {
    rawEvents,
    ...eventsQuery,
  };
}

export function useLeavesByStatus(
  leaveStatus: LeaveStatus
): UseQueryResult<Event[]> & { rawEvents: Event[] } {
  const eventsQuery = useQuery(['events', leaveStatus], async () => {
    return client<Event[]>(`leaves/${leaveStatus}`);
  });

  const rawEvents = eventsQuery.data ?? [];
  return {
    rawEvents,
    ...eventsQuery,
  };
}

export function usePatientEvents(
  patientId: string
): UseQueryResult<Event[]> & { patientEvents: Event[] } {
  const patientEventsQuery = useQuery(['events', patientId], async () => {
    return client<Event[]>(`patients/events/${patientId}`);
  });

  const patientEvents = patientEventsQuery.data ?? [];
  return {
    patientEvents,
    ...patientEventsQuery,
  };
}

export function useCreateEvent(): UseMutationResult<
  Event,
  Error,
  { event: NewEvent },
  string
> {
  const queryClient = useQueryClient();
  const createEvent = async ({
    event,
  }: {
    event: NewEvent;
  }): Promise<Event> => {
    return client<NewEvent, Event>('events', { data: event });
  };
  return useMutation(createEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useUpdateEvent(): UseMutationResult<
  Event,
  Error,
  { event: Event },
  string
> {
  const queryClient = useQueryClient();
  const updateEvent = async ({ event }: { event: Event }): Promise<Event> => {
    return client<Event>(`events/${event.uuid}`, {
      data: event,
      method: 'PATCH',
    });
  };
  return useMutation(updateEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useUpdateCurrentAndFutureEvent(): UseMutationResult<
  Event,
  Error,
  { event: Event },
  string
> {
  const queryClient = useQueryClient();
  const updateCurrentAndFutureEvent = async ({
    event,
  }: {
    event: Event;
  }): Promise<Event> => {
    return client<Event>(`events/cf/${event.uuid}`, {
      data: event,
      method: 'PATCH',
    });
  };
  return useMutation(updateCurrentAndFutureEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
}

export function useApproveLeave(): UseMutationResult<
  Event,
  Error,
  { event: Event },
  string
> {
  const queryClient = useQueryClient();
  const updateEvent = async ({ event }: { event: Event }): Promise<Event> => {
    return client<Event>(`leaves/${event.uuid}`, {
      method: 'PATCH',
    });
  };
  return useMutation(updateEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
}

const cancellationReasonsRoute = 'settings/event/cr';

export function useCreateCancellationReason(): UseMutationResult<
  CancellationReasonCreate,
  Error,
  { cr: CancellationReasonCreate },
  string
> {
  const queryClient = useQueryClient();
  const createCancellationReason = async ({
    cr,
  }: {
    cr: CancellationReasonCreate;
  }): Promise<CancellationReasonCreate> => {
    return client<CancellationReasonCreate>(cancellationReasonsRoute, {
      data: cr,
    });
  };
  return useMutation(createCancellationReason, {
    onSuccess: () => {
      queryClient.invalidateQueries([cancellationReasonsRoute]);
    },
  });
}

export function useUpdateCancellationReason(): UseMutationResult<
  CancellationReason,
  Error,
  { cr: CancellationReason },
  string
> {
  const queryClient = useQueryClient();
  const updateCancellationReason = async ({
    cr,
  }: {
    cr: CancellationReason;
  }): Promise<CancellationReason> => {
    return client<CancellationReason>(cancellationReasonsRoute, {
      data: cr,
      method: 'PATCH',
    });
  };
  return useMutation(updateCancellationReason, {
    onSuccess: () => {
      queryClient.invalidateQueries([cancellationReasonsRoute]);
    },
  });
}

export function useAllCancellationReasons(): UseQueryResult<
  CancellationReason[]
> & { cancellationReasons: CancellationReason[] } {
  const usersQuery = useQuery([cancellationReasonsRoute], async () => {
    return client<CancellationReason[]>(cancellationReasonsRoute);
  });

  const cancellationReasons = usersQuery.data ?? [];

  return {
    cancellationReasons,
    ...usersQuery,
  };
}

export function useDeleteCancellationReason(): UseMutationResult<
  { message: string },
  Error,
  { id: string },
  string
> {
  const queryClient = useQueryClient();
  const deleteCancellationReason = async ({
    id,
  }: {
    id: string;
  }): Promise<{ message: string }> => {
    return client<{ message: string }>(`${cancellationReasonsRoute}/${id}`, {
      method: 'DELETE',
    });
  };

  return useMutation(deleteCancellationReason, {
    onSuccess: () => {
      queryClient.invalidateQueries([cancellationReasonsRoute]);
    },
  });
}
