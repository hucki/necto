import { Dayjs } from 'dayjs';

interface TeamMembers {
  uuid: string;
  firstName: string;
  lastName: string;
  appointmentsPerWeek: number;
  color: string;
  planningProcess: number;
}

export type AppState = {
  appointments: {
    teamMembers: TeamMembers;
  };
  settings: {
    hoursInterval: [number, number];
  };
  userData: {
    currentUser: string;
    currentUserId: number;
  };
};
