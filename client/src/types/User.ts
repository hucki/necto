export type User = {
  id?: number;
  a0Id: string;
  firstName: string;
  lastName: string;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TeamMember = {
  id: number;
  a0Id: string;
  firstName: string;
  lastName: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  hoursPerWeek: number | null;
  appointmentsPerWeek: number | null;
  bgColor: string;
  planningProgress?: number;
};
