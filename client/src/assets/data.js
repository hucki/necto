import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

export const teamMembers = [
  {
    id: 1,
    firstName: 'Anja',
    lastName: 'Bidmead',
    appointmentsPerWeek: 30,
    color: 'blue',
    planningProgress: 0,
  },
  {
    id: 2,
    firstName: 'Biene',
    lastName: 'Blitzer',
    appointmentsPerWeek: 30,
    color: 'red',
    planningProgress: 0,
  },
  {
    id: 3,
    firstName: 'Biggi',
    lastName: 'Bernollet',
    appointmentsPerWeek: 20,
    color: 'green',
    planningProgress: 0,
  },
  {
    id: 4,
    firstName: 'Charlie',
    lastName: 'Horsburgh',
    appointmentsPerWeek: 15,
    color: 'yellow',
    planningProgress: 0,
  },
  {
    id: 5,
    firstName: 'Forbes',
    lastName: 'Elgy',
    appointmentsPerWeek: 20,
    color: 'grey',
    planningProgress: 0,
  },
];

export const groups = [
  { id: 1, title: 'group 1' },
  { id: 2, title: 'group 2' },
];
export const items = [
  {
    id: 1,
    group: 1,
    title: 'item 1',
    start_time: dayjs(),
    end_time: dayjs().add(1, 'hour'),
  },
  {
    id: 2,
    group: 2,
    title: 'item 2',
    start_time: dayjs().add(-0.5, 'hour'),
    end_time: dayjs().add(0.5, 'hour'),
  },
  {
    id: 3,
    group: 1,
    title: 'item 3',
    start_time: dayjs().add(2, 'hour'),
    end_time: dayjs().add(3, 'hour'),
  },
];

export const initialState = {
  appointments: {
    teamMembers: teamMembers,
  },
  current: {
    currentDate: dayjs(),
  },
  currentTeam: null,
  currentCompany: null,
  settings: {
    hoursInterval: [7, 19],
    currentView: 'Appointments',
  },
  newAppointment: {
    inputFormVisible: false,
    clickedRowId: '',
    startTime: dayjs().set('seconds', 0),
    endTime: dayjs().add(45, 'm').set('seconds', 0),
    rrule: '',
  },
  userData: {
    currentUser: 'Biggi',
    currentUserId: 3,
  },
  teamtable: {
    viewportDimensions: {
      width: 0,
      height: 0,
      top: 0,
    },
    calculatedDimensions: {
      cellHeight: 0,
      cellWidth: 0,
      relCellHeight: 0,
    },
    settings: {
      daysToShow: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      timeScaleWidth: 50,
    },
  },
};
