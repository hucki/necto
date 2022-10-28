import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { ContactData } from '../types/ContactData';

export function useCreatePatientContact(): UseMutationResult<
  ContactData,
  Error,
  { contactData: ContactData },
  string
> {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries(['patients']);
    },
  });
}
export function useCreateDoctorContact(): UseMutationResult<
  ContactData,
  Error,
  { contactData: ContactData },
  string
> {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries(['doctors']);
    },
  });
}

export function useUpdateContact(): UseMutationResult<
  ContactData,
  Error,
  { contactData: ContactData },
  string
> {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['doctors']);
      queryClient.invalidateQueries(['waiting']);
    },
  });
}
