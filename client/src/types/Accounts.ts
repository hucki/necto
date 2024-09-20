export type NewAccount = {
  unit: string;
  description: string;
  timeTypeId: string;
  validFrom: string;
  validUntil: string;
};

export type Account = {
  uuid: string;
  creatadAt: string;
  updatedAt: string;
} & NewAccount;
