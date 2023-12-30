import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Employee } from '../types/Employee';
import { TimesAPIResponse } from '../types/Api';
import { client } from '../services/ApiClient';
import { NewTimesheetEntry, TimesheetEntry } from '../types/Times';

type TimesProps = {
  employeeId: Employee['uuid'];
  includes?: string;
};

export function useCreateTimsheetEntry(): UseMutationResult<
  TimesheetEntry,
  Error,
  { timesheetEntry: NewTimesheetEntry },
  string
> {
  const queryClient = useQueryClient();
  const createTimesheetEntry = async ({
    timesheetEntry,
  }: {
    timesheetEntry: NewTimesheetEntry;
  }): Promise<TimesheetEntry> => {
    return client<NewTimesheetEntry, TimesheetEntry>('v2/times', {
      data: timesheetEntry,
    });
  };
  return useMutation(createTimesheetEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(['times']);
    },
  });
}

/**
 * universal V2 JSON API time bookings getter
 */
export function useTimes({
  employeeId,
  includes,
}: TimesProps): UseQueryResult<TimesAPIResponse> & {
  rawTimes: TimesheetEntry[];
} {
  const filterParameter = ['employeeId'] as const;
  type FilterParameter = (typeof filterParameter)[number];
  type QueryParams = {
    [key in FilterParameter as `filter[${key}]`]?: string;
  } & {
    includes?: string;
  };

  const queryParams: QueryParams = { includes };
  queryParams['filter[employeeId]'] = employeeId;

  const timesQuery = useQuery(['times', employeeId], async () => {
    return client<TimesAPIResponse>('v2/times', {
      queryParams,
    });
  });

  const rawTimes = timesQuery.data?.data?.map((e) => e.attributes) ?? [];
  return {
    rawTimes,
    ...timesQuery,
  };
}
