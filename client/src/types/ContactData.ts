export type ContactData = {
  uuid?: string;
  type: 'telephone' | 'email';
  contact: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
  patientId?: string;
  doctorId?: string;
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
