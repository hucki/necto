export type UserSettings = {
  id?: number;
  userId: number;
  bgColor: string;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Contract = {
  id?: number;
  userId: number;
  hoursPerWeek: number;
  appointmentsPerWeek: number;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
