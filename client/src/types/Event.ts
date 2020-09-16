export type Event = {
  id?: number;
  userId: number;
  name: string;
  type: string;
  homeVisit: boolean;
  rrule: string;
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Appointment = {
  id?: number;
  rowId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  rrule: string;
  bgColor: string;
  homeVisit: boolean;
};
