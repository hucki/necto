import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);


export const teamMembers = [
  { id: 1, firstName: 'Mitchell', lastName: 'Bidmead', color: 'grey'},
  { id: 2, firstName: 'Gigi', lastName: 'Blitzer', color: 'green'},
  { id: 3, firstName: 'Trisha', lastName: 'Bernollet', color: 'red'},
  { id: 4, firstName: 'Charlie', lastName: 'Horsburgh', color: 'yellow'},
  { id: 5, firstName: 'Forbes', lastName: 'Elgy', color: 'blue'}
];
export const pureEvents = [
  {
    id: 1,
    personId: 1,
    name: 'Mr. Miller',
    type: 'custom',
    startTime: dayjs().set('hours',11).set('minutes',30),
    endTime: dayjs().set('hours',12).set('minutes',15),
    rrule: ''
  },
  {
    id: 4,
    personId: 1,
    name: 'Mrs. Smith',
    type: 'custom',
    startTime: dayjs().set('hours',12).set('minutes',30),
    endTime: dayjs().set('hours',13).set('minutes',15),
    rrule: ''
  },
  {
    id: 2,
    personId: 2,
    name: 'Lisa',
    type: 'custom',
    startTime: dayjs().set('hours',12).set('minutes',30),
    endTime: dayjs().set('hours',14).set('minutes',30),
    rrule: ''
  },
  {
    id: 3,
    personId: 2,
    name: 'Paul',
    type: 'custom',
    startTime: dayjs().set('hours',14).set('minutes',45),
    endTime: dayjs().set('hours',15).set('minutes',30),
    rrule: ''
  },
  {
    id: 5,
    personId: 3,
    name: 'Jack',
    type: 'custom',
    startTime: dayjs().set('hours',8).set('minutes',30),
    endTime: dayjs().set('hours',10).set('minutes',30),
    rrule: ''
  },
  {
    id: 6,
    personId: 3,
    name: 'Jill',
    type: 'custom',
    startTime: dayjs().set('hours',10).set('minutes',45),
    endTime: dayjs().set('hours',11).set('minutes',30),
    rrule: ''
  }
];

export const groups = [
  { id: 1, title: 'group 1' },
  { id: 2, title: 'group 2' }
];
export const items = [
  { id: 1, group: 1, title: 'item 1', start_time: dayjs(), end_time: dayjs().add(1, 'hour')},
  { id: 2, group: 2, title: 'item 2', start_time: dayjs().add(-0.5, 'hour'), end_time: dayjs().add(0.5, 'hour')},
  { id: 3, group: 1, title: 'item 3', start_time: dayjs().add(2, 'hour'), end_time: dayjs().add(3, 'hour')}
];

export const events = (teamMembers, pureEvents) => {
  const teamEvents = {};
  teamMembers.map(member => {
    teamEvents[member.firstName] = [];
    pureEvents.map(event => {
      if (event.personId === member.id) {
        event.bgcolor = `bg_${member.color}`;
        teamEvents[member.firstName] = [...teamEvents[member.firstName], event];
      }
      return event;
    });
    return member;
  });
  return teamEvents;
};

export const initialState = {
  appointments: {
    pureEvents: pureEvents,
    teamMembers: teamMembers,
    events: events(teamMembers, pureEvents),
    maxId: pureEvents.length
  },
  current: {currentDate: dayjs()},
  settings: { hoursInterval: [ 6, 19 ] },
  newAppointment: {
    inputFormVisible: false,
    clickedRowId: '',
    startTime: dayjs().set('seconds',0),
    endTime: dayjs().add(45, 'm').set('seconds',0)
  }
};
