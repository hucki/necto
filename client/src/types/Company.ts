export type Company = {
  uuid: string;
  name: string;
  name2: string;
  street: string;
  zip: string;
  city: string;
  bankIban?: string;
  bankBic?: string;
  tenantId: string;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
