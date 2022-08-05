export type ContactData = {
  uuid?: string;
  type: 'telephone' | 'email';
  contact: string;
  createdAt?: Date;
  updatedAt?: Date;
  tenantId?: string;
};

export type PatientContactData = ContactData & {
  patientId?: string;
};

export type DoctorContactData = ContactData & {
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
