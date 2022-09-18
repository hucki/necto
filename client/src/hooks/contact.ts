import { useMutation, queryCache, MutationResultPair } from 'react-query';
import { client } from '../services/ApiClient';
import { ContactData } from '../types/ContactData';

export function useCreatePatientContact(): MutationResultPair<
  ContactData,
  Error,
  { contactData: ContactData },
  string
> {
  const createPatientContact = async ({
    contactData,
  }: {
    contactData: ContactData;
  }): Promise<ContactData> => {
    return client<ContactData>(`patients/${contactData.patientId}/contact`, {
      data: contactData,
    });
  };
  return useMutation(createPatientContact, {
    onSuccess: () => {
      queryCache.invalidateQueries('patients');
    },
  });
}
export function useCreateDoctorContact(): MutationResultPair<
  ContactData,
  Error,
  { contactData: ContactData },
  string
> {
  const createDoctorContact = async ({
    contactData,
  }: {
    contactData: ContactData;
  }): Promise<ContactData> => {
    return client<ContactData>(`doctors/${contactData.doctorId}/contact`, {
      data: contactData,
    });
  };
  return useMutation(createDoctorContact, {
    onSuccess: () => {
      queryCache.invalidateQueries('doctors');
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
    return client<ContactData>(`contact/${contactData.uuid}`, {
      data: contactData,
      method: 'PATCH',
    });
  };
  return useMutation(updateContact, {
    onSuccess: () => {
      queryCache.invalidateQueries('patients');
      queryCache.invalidateQueries('doctors');
      queryCache.invalidateQueries('waiting');
    },
  });
}
