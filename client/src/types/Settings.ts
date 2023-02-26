export type WaitingPreference = {
  key: string;
  label: string;
  tenantId?: string;
  _count: {
    patients: number;
  };
};

export type WaitingPreferenceCreate = Pick<WaitingPreference, 'key' | 'label'>;
