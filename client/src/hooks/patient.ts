import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Patient } from '../types/Patient';
import { WaitingPreference } from '../types/Settings';
import { Institution } from '../types/Institution';
import { PatientAPIResponse } from '../types/Api';

export function useCreatePatient(): UseMutationResult<
  Patient,
  Error,
  { patient: Patient },
  string
> {
  const queryClient = useQueryClient();
  const createPatient = async ({
    patient,
  }: {
    patient: Patient;
  }): Promise<Patient> => {
    return client<Patient>('patients', { data: patient });
  };
  return useMutation(createPatient, {
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
    },
  });
}

export function useUpdatePatient(): UseMutationResult<
  Patient,
  Error,
  { patient: Patient },
  string
> {
  const queryClient = useQueryClient();
  const updatePatient = async ({
    patient,
  }: {
    patient: Patient;
  }): Promise<Patient> => {
    return client<Patient>(`patients/${patient.uuid}`, {
      data: patient,
      method: 'PATCH',
    });
  };
  return useMutation(updatePatient, {
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['waitingPatients']);
      queryClient.invalidateQueries(['archivedPatients']);
    },
  });
}

type PatientWaitingPreferenceData = {
  patientId: Patient['uuid'];
  waitingPreferenceKey: WaitingPreference['key'];
};

export function useConnectWaitingPreference(): UseMutationResult<
  PatientWaitingPreferenceData,
  Error,
  PatientWaitingPreferenceData,
  string
> {
  const queryClient = useQueryClient();
  const updatePatient = async ({
    patientId,
    waitingPreferenceKey,
  }: PatientWaitingPreferenceData): Promise<PatientWaitingPreferenceData> => {
    return client<PatientWaitingPreferenceData>('patients/connect/wp', {
      data: {
        patientId,
        waitingPreferenceKey,
      },
      method: 'PATCH',
    });
  };
  return useMutation(updatePatient, {
    onSuccess: () => {
      queryClient.invalidateQueries(['patients/connect/wp']);
      queryClient.invalidateQueries(['settings/wp']);
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['waitingPatients']);
      queryClient.invalidateQueries(['archivedPatients']);
    },
  });
}

export function useDisconnectWaitingPreference(): UseMutationResult<
  PatientWaitingPreferenceData,
  Error,
  PatientWaitingPreferenceData,
  string
> {
  const queryClient = useQueryClient();
  const updatePatient = async ({
    patientId,
    waitingPreferenceKey,
  }: PatientWaitingPreferenceData): Promise<PatientWaitingPreferenceData> => {
    return client<PatientWaitingPreferenceData>('patients/disconnect/wp', {
      data: {
        patientId,
        waitingPreferenceKey,
      },
      method: 'PATCH',
    });
  };
  return useMutation(updatePatient, {
    onSuccess: () => {
      queryClient.invalidateQueries(['patients/disconnect/wp']);
      queryClient.invalidateQueries(['settings/wp']);
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['waitingPatients']);
      queryClient.invalidateQueries(['archivedPatients']);
    },
  });
}

export function useAllPatients(): UseQueryResult<Patient[]> & {
  patients: Patient[];
} {
  const patientsQuery = useQuery(['patients'], async () => {
    return client<Patient[]>('patients/all');
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}

export function useFilteredPatients({
  institutionId,
}: {
  institutionId: string;
}): UseQueryResult<Patient[]> & {
  patients: Patient[];
} {
  const patientsQuery = useQuery(['patients'], async () => {
    const queryParams = { institutionId: institutionId };
    return client<Patient[]>('patients/filtered/', {
      queryParams: queryParams,
    });
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}

export function useAllArchivedPatients(): UseQueryResult<Patient[]> & {
  archivedPatients: Patient[];
} {
  const archivedPatientsQuery = useQuery(['archivedPatients'], async () => {
    return client<Patient[]>('patients/archived');
  });

  const archivedPatients = archivedPatientsQuery.data ?? [];

  return {
    archivedPatients,
    ...archivedPatientsQuery,
  };
}

export function useAllWaitingPatients(): UseQueryResult<Patient[]> & {
  patients: Patient[];
} {
  const patientsQuery = useQuery(['waitingPatients'], async () => {
    return client<Patient[]>('patients/waiting');
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}

type BasePatientProps = {
  filter?: {
    institutionId?: Institution['uuid'];
  };
  includes?: string;
  page?: {
    offset: string;
    limit: string;
  };
};

/**
 * universal V2 JSON API patient getter
 */
export function usePatients({
  filter,
  includes,
  page,
}: BasePatientProps): UseQueryResult<PatientAPIResponse> & {
  rawPatients: Patient[];
} {
  const institutionId = filter?.institutionId;
  const filterParameter = ['institutionId'] as const;
  const paginationParameter = ['limit', 'offset'] as const;
  type FilterParameter = (typeof filterParameter)[number];
  type PaginationParameter = (typeof paginationParameter)[number];
  type QueryParams = {
    [key in FilterParameter as `filter[${key}]`]?: string;
  } & {
    [key in PaginationParameter as `page[${key}]`]?: string;
  } & {
    includes?: string;
  };
  const queryParams: QueryParams = {
    'filter[institutionId]': institutionId ? institutionId : undefined,
    'page[limit]': page?.limit ? page.limit : undefined,
    'page[offset]': page?.offset ? page?.offset : undefined,
    includes,
  };
  const hasQueryParams = Boolean(
    includes || !Object.entries(queryParams).find((e) => e !== undefined)
  );
  const patientsQuery = useQuery(['patients'], async () => {
    return client<PatientAPIResponse>('v2/patients', {
      queryParams: hasQueryParams ? queryParams : undefined,
    });
  });

  const rawPatients = patientsQuery.data?.data.map((p) => p.attributes) ?? [];
  return {
    rawPatients,
    ...patientsQuery,
  };
}
