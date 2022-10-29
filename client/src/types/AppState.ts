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
    currentView: string;
  };
  userData: {
    currentUser: string;
    currentUserId: number;
  };
};
