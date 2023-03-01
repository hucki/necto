import { Patient } from './Patient';

export type WaitingPreference = {
  key: string;
  label: string;
  tenantId?: string;
  _count: {
    patients: number;
  };
  patients: { uuid: Patient['uuid'] }[];
};

export type WaitingPreferenceCreate = Pick<WaitingPreference, 'key' | 'label'>;
