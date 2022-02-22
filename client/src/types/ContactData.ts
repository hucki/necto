export type ContactData = {
  uuid?: string;
  type: string;
  contact: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
};

export type PatientContactData = ContactData & {
  patientId?: string;
};

export type UserContactData = ContactData & {
  userId?: string;
};

export type EmployeeContactData = ContactData & {
  employeeId?: string;
};
