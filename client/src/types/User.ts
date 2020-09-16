export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TeamMember = {
  id: number;
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
