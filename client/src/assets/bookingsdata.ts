import { Room } from '../types/Ressource';
import { Building, PersonBookings } from '../types/Rooms';

export const buildings: Building[] = [
  {
    id: 1,
    displayName: 'Mundwerk Arnsberg',
  },
  {
    id: 2,
    displayName: 'Mundwerk Neheim',
  },
];

export const rooms: Room[] = [
  {
    id: 1,
    building: 1,
    shortDescription: 'Anja',
    displayName: '01',
    longDescription: 'Therapiezimmer vorne rechts',
    bgColor: 'red',
  },
  {
    id: 2,
    building: 1,
    shortDescription: 'Biene',
    displayName: '02',
    longDescription: 'Therapiezimmer hinten rechts',
    bgColor: 'grey',
  },
  {
    id: 3,
    building: 1,
    shortDescription: 'Biggi',
    displayName: '03',
    longDescription: 'Therapiezimmer hinten links',
    bgColor: 'green',
  },
  {
    id: 4,
    building: 1,
    displayName: '04',
    shortDescription: 'Nadine',
    longDescription: 'Therapiezimmer vorne links',
    bgColor: 'blue',
  },
  {
    id: 5,
    building: 2,
    displayName: '05',
    shortDescription: 'Wiebke',
    longDescription: 'Therapiezimmer rechts',
    bgColor: 'red',
  },
  {
    id: 6,
    building: 2,
    shortDescription: 'Mitte',
    displayName: '06',
    longDescription: 'Therapiezimmer Mitte',
    bgColor: 'grey',
  },
  {
    id: 7,
    building: 2,
    displayName: '07',
    shortDescription: 'Links',
    longDescription: 'Therapiezimmer links',
    bgColor: 'green',
  },
];
export const bookingsPerPerson: PersonBookings[] = [
  {
    userId: 1,
    name: 'Anja',
    bgColor: 'blue',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: 1,
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: 1,
            start: '11:30',
            end: '19:00',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 1,
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: 1,
            start: '11:30',
            end: '12:15',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 1,
            start: '07:00',
            end: '19:00',
          },
        ],
      },
      {
        name: 'thursday',
        bookings: [
          {
            roomId: 1,
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: 1,
            start: '11:30',
            end: '19:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: 1,
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: 1,
            start: '11:30',
            end: '15:00',
          },
        ],
      },
    ],
  },
  {
    userId: 3,
    name: 'Theresa',
    bgColor: 'red',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: 3,
            start: '13:30',
            end: '18:00',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 3,
            start: '08:15',
            end: '09:00',
          },
          {
            roomId: 2,
            start: '09:00',
            end: '16:15',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 2,
            start: '14:15',
            end: '17:15',
          },
        ],
      },
      {
        name: 'thursday',
        bookings: [
          {
            roomId: 3,
            start: '09:15',
            end: '16:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: 3,
            start: '07:45',
            end: '09:15',
          },
        ],
      },
    ],
  },
  {
    userId: 4,
    name: 'Biggi',
    bgColor: 'green',
    days: [
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 3,
            start: '12:15',
            end: '16:45',
          },
        ],
      },

      {
        name: 'thursday',
        bookings: [
          {
            roomId: 3,
            start: '08:00',
            end: '09:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: 3,
            start: '13:00',
            end: '15:15',
          },
        ],
      },
    ],
  },
  {
    userId: 5,
    name: 'Nadine',
    bgColor: 'yellow',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: 4,
            start: '12:30',
            end: '14:45',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 4,
            start: '07:45',
            end: '08:15',
          },
          {
            roomId: 4,
            start: '12:45',
            end: '17:15',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 4,
            start: '08:15',
            end: '14:15',
          },
        ],
      },

      {
        name: 'thursday',
        bookings: [
          {
            roomId: 4,
            start: '08:15',
            end: '12:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: 4,
            start: '13:30',
            end: '18:00',
          },
        ],
      },
    ],
  },
  {
    userId: 6,
    name: 'Biene',
    bgColor: 'purple',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: 2,
            start: '07:30',
            end: '09:00',
          },
          {
            roomId: 2,
            start: '16:00',
            end: '18:30',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 2,
            start: '07:30',
            end: '08:30',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 2,
            start: '07:30',
            end: '09:00',
          },
        ],
      },

      {
        name: 'thursday',
        bookings: [
          {
            roomId: 2,
            start: '07:30',
            end: '09:00',
          },
          {
            roomId: 2,
            start: '15:00',
            end: '18:30',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: 2,
            start: '07:30',
            end: '12:00',
          },
        ],
      },
    ],
  },
  {
    userId: 7,
    name: 'Evelyn',
    bgColor: 'mint',
    days: [
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 3,
            start: '12:00',
            end: '16:00',
          },
        ],
      },
    ],
  },
  {
    userId: 8,
    name: 'Wiebke',
    bgColor: 'red',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: 5,
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: 5,
            start: '12:00',
            end: '16:00',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 5,
            start: '07:00',
            end: '17:00',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 5,
            start: '13:15',
            end: '17:00',
          },
        ],
      },
      {
        name: 'thursday',
        bookings: [
          {
            roomId: 5,
            start: '07:00',
            end: '08:00',
          },
          {
            roomId: 5,
            start: '12:00',
            end: '16:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: 5,
            start: '07:30',
            end: '10:00',
          },
        ],
      },
    ],
  },
];
