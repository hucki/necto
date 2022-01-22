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
  current: {
    currentDate: Dayjs;
  };
  settings: {
    hoursInterval: [number, number];
    currentView: string;
  };
  newAppointment: {
    inputFormVisible: boolean;
    clickedRowId: string;
    startTime: Dayjs;
    endTime: Dayjs;
    rrule: string;
  };
  userData: {
    currentUser: string;
    currentUserId: number;
  };
  teamtable: {
    viewportDimensions: {
      width: number;
      height: number;
      top: number;
    };
    calculatedDimensions: {
      cellHeight: number;
      cellWidth: number;
      relCellHeight: number;
    };
    settings: {
      daysToShow: string[];
      timeScaleWidth: number;
    };
  };
};
