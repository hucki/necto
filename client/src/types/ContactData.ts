export type ContactType = 'telephone' | 'fax' | 'email';

export type ContactData = {
  uuid?: string;
  type: ContactType;
  contact: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
  patientId?: string;
  doctorId?: string;
  institutionId?: string;
};

export type UserContactData = ContactData & {
  userId?: string;
};

export type EmployeeContactData = ContactData & {
  employeeId?: string;
};

export type InstitutionContactData = ContactData & {
  institutionId?: string;
};
