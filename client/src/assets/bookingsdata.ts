import { PersonBookings } from '../types/Rooms';

export const bookingsPerPerson: PersonBookings[] = [
  {
    employeeId: '8e499c60-77ba-4c5f-9388-b81df2cea1af',
    name: 'Anja',
    bgColor: 'blue',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '11:30',
            end: '19:00',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '11:30',
            end: '12:15',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '11:30',
            end: '19:00',
          },
        ],
      },
      {
        name: 'thursday',
        bookings: [
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '11:30',
            end: '19:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: '51532e87-ea42-4ee5-a706-47654675f42b',
            start: '11:30',
            end: '15:00',
          },
        ],
      },
    ],
  },
  {
    employeeId: 'd5137354-4ffe-486f-a885-633aeea323ac',
    name: 'Theresa',
    bgColor: 'red',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '13:30',
            end: '18:00',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '08:15',
            end: '09:00',
          },
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '09:00',
            end: '16:15',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '14:15',
            end: '17:15',
          },
        ],
      },
      {
        name: 'thursday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '09:15',
            end: '16:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '07:45',
            end: '09:15',
          },
        ],
      },
    ],
  },
  {
    employeeId: '69c1e074-5ec3-436d-9db3-b258ba9d5b94',
    name: 'Biggi',
    bgColor: 'green',
    days: [
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '12:15',
            end: '16:45',
          },
        ],
      },

      {
        name: 'thursday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '08:00',
            end: '09:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '13:00',
            end: '15:15',
          },
        ],
      },
    ],
  },
  {
    employeeId: 'f5c6eb4f-d198-4219-a564-5e0e9c0dfc88',
    name: 'Nadine',
    bgColor: 'yellow',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: 'c4811ecc-e83f-4850-96dd-381c2ff6cf8d',
            start: '12:30',
            end: '14:15',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 'c4811ecc-e83f-4850-96dd-381c2ff6cf8d',
            start: '07:45',
            end: '08:15',
          },
          {
            roomId: 'c4811ecc-e83f-4850-96dd-381c2ff6cf8d',
            start: '12:45',
            end: '17:15',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 'c4811ecc-e83f-4850-96dd-381c2ff6cf8d',
            start: '08:15',
            end: '14:15',
          },
        ],
      },

      {
        name: 'thursday',
        bookings: [
          {
            roomId: 'c4811ecc-e83f-4850-96dd-381c2ff6cf8d',
            start: '08:15',
            end: '12:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: 'c4811ecc-e83f-4850-96dd-381c2ff6cf8d',
            start: '13:30',
            end: '18:00',
          },
        ],
      },
    ],
  },
  {
    employeeId: '968a07ff-af82-48cc-b60e-c546141b26ee',
    name: '🐝 Biene',
    bgColor: 'purple',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '07:30',
            end: '09:00',
          },
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '16:00',
            end: '18:30',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '07:30',
            end: '08:30',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '07:30',
            end: '09:00',
          },
        ],
      },

      {
        name: 'thursday',
        bookings: [
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '07:30',
            end: '09:00',
          },
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '15:00',
            end: '18:30',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '07:30',
            end: '12:00',
          },
        ],
      },
    ],
  },
  {
    employeeId: '7051c676-6624-4191-9ae1-9997b22efbdb',
    name: 'Evelyn',
    bgColor: 'mint',
    days: [
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: '37414bd7-a295-4ed7-abc8-e1b4caf95d88',
            start: '12:00',
            end: '16:00',
          },
        ],
      },
    ],
  },
  {
    employeeId: '537146d9-a0ae-4694-9dfe-423a702438bf',
    name: 'Wiebke',
    bgColor: 'red',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: '3f625b42-09f8-4381-a890-c9ea51975b51',
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: '3f625b42-09f8-4381-a890-c9ea51975b51',
            start: '12:00',
            end: '16:00',
          },
        ],
      },
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: '3f625b42-09f8-4381-a890-c9ea51975b51',
            start: '07:00',
            end: '17:00',
          },
        ],
      },
      {
        name: 'wednesday',
        bookings: [
          {
            roomId: '3f625b42-09f8-4381-a890-c9ea51975b51',
            start: '13:15',
            end: '17:00',
          },
        ],
      },
      {
        name: 'thursday',
        bookings: [
          {
            roomId: '3f625b42-09f8-4381-a890-c9ea51975b51',
            start: '07:00',
            end: '08:00',
          },
          {
            roomId: '3f625b42-09f8-4381-a890-c9ea51975b51',
            start: '12:00',
            end: '16:00',
          },
        ],
      },
      {
        name: 'friday',
        bookings: [
          {
            roomId: '3f625b42-09f8-4381-a890-c9ea51975b51',
            start: '07:30',
            end: '10:00',
          },
        ],
      },
    ],
  },
  {
    employeeId: '5028bcd8-ee58-490c-9e12-ff44a6708228',
    name: 'Nicola',
    bgColor: 'blue',
    days: [
      {
        name: 'monday',
        bookings: [
          {
            roomId: 'b9e3f812-6a6e-4b62-b21b-cc8ad0881a96',
            start: '07:00',
            end: '11:00',
          },
        ],
      },

      {
        name: 'wednesday',
        bookings: [
          {
            roomId: 'b9e3f812-6a6e-4b62-b21b-cc8ad0881a96',
            start: '07:00',
            end: '09:00',
          },
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '10:15',
            end: '11:45',
          },
        ],
      },
    ],
  },
  {
    employeeId: '6b6eee44-c751-4341-a32b-e4030c0bc9aa',
    name: 'Roswitha',
    bgColor: 'green',
    days: [
      {
        name: 'tuesday',
        bookings: [
          {
            roomId: 'b9e3f812-6a6e-4b62-b21b-cc8ad0881a96',
            start: '12:45',
            end: '15:00',
          },
        ],
      },

      {
        name: 'thursday',
        bookings: [
          {
            roomId: 'b9e3f812-6a6e-4b62-b21b-cc8ad0881a96',
            start: '12:45',
            end: '14:15',
          },
          {
            roomId: '4f9b422d-7541-469a-bff7-564ad2965b66',
            start: '10:15',
            end: '11:45',
          },
        ],
      },
    ],
  },
];
