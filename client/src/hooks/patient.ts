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
      queryClient.invalidateQueries(['settings/wp']);
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
      queryClient.invalidateQueries(['settings/wp']);
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
