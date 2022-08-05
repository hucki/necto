import {
  useMutation,
  queryCache,
  MutationResultPair,
} from 'react-query';
import { client } from '../services/ApiClient';
import { ContactData, PatientContactData } from '../types/ContactData';

export function useCreatePatientContact(): MutationResultPair<
  PatientContactData,
  Error,
  { contactData: PatientContactData },
  string
  > {
  const createPatient = async ({
    contactData,
  }: {
    contactData: PatientContactData;
  }): Promise<PatientContactData> => {
    return client<PatientContactData>(`patients/${contactData.patientId}/contact`, { data: contactData });
  };
  return useMutation(createPatient, {
    onSuccess: () => {
      queryCache.invalidateQueries('patients');
    },
  });
}

export function useUpdateContact(): MutationResultPair<
  ContactData,
  Error,
  { contactData: ContactData },
  string
  > {
  const updateContact = async ({
    contactData,
  }: {
    contactData: ContactData;
  }): Promise<ContactData> => {
    return client<ContactData>(`contact/${contactData.uuid}`, { data: contactData, method: 'PATCH' });
  };
  return useMutation(updateContact, {
    onSuccess: () => {
      queryCache.invalidateQueries('patients');
      queryCache.invalidateQueries('doctors');
      queryCache.invalidateQueries('waiting');
    },
  });
}
