import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday)


export const teamMembers = [
  { id: 1, firstName: 'Mitchell', lastName: 'Bidmead', color: 'black'},
  { id: 2, firstName: 'Gigi', lastName: 'Blitzer', color: 'green'},
  { id: 3, firstName: 'Trisha', lastName: 'Bernollet', color: 'red'},
  { id: 4, firstName: 'Charlie', lastName: 'Horsburgh', color: 'yellow'},
  { id: 5, firstName: 'Forbes', lastName: 'Elgy', color: 'blue'},
  { id: 6, firstName: 'Alfie', lastName: 'Dainton', color: 'olive'},
  { id: 7, firstName: 'Andriette', lastName: 'Delagua', color: 'purple'},
  { id: 8, firstName: 'Jojo', lastName: 'Heigl', color: 'orange'},
  { id: 9, firstName: 'Pearce', lastName: 'Ungerecht', color: 'pink'},
  { id: 10, firstName: 'Alanah', lastName: 'Bentje', color: 'green'}
]
export const groups = [
  { id: 1, title: 'group 1' },
  { id: 2, title: 'group 2' }
]
export const items = [
  { id: 1, group: 1, title: 'item 1', start_time: dayjs(), end_time: dayjs().add(1, 'hour')},
  { id: 2, group: 2, title: 'item 2', start_time: dayjs().add(-0.5, 'hour'), end_time: dayjs().add(0.5, 'hour')},
  { id: 3, group: 1, title: 'item 3', start_time: dayjs().add(2, 'hour'), end_time: dayjs().add(3, 'hour')}
]

export const events = {
  'Person 1': [
    {
      id: 1,
      name: 'Custom Event 1',
      type: 'custom',
      startTime: dayjs('2020-07-30T11:30:00'),
      endTime: dayjs('2020-07-30T13:30:00'),
      style: 'bg_green'
    },
    {
      id: 4,
      name: 'Custom Event 4',
      type: 'custom',
      startTime: dayjs('2020-07-30T08:30:00'),
      endTime: dayjs('2020-07-30T09:30:00'),
      style: 'bg_green'
    }
  ],
  'Person 2': [
    {
      id: 2,
      name: 'Custom Event 2',
      type: 'custom',
      startTime: dayjs('2020-07-30T12:30:00'),
      endTime: dayjs('2020-07-30T14:30:00'),
      style: 'bg_green'
    },
    {
      id: 3,
      name: 'Custom Event 3',
      type: 'custom',
      startTime: dayjs('2020-07-30T16:30:00'),
      endTime: dayjs('2020-07-30T18:45:00'),
      style: 'bg_green'
    }
  ]
};
