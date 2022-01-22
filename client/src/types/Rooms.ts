import { BgColor } from './Colors';

interface Booking {
  roomId: string;
  start: string;
  end: string;
}
type BookingDayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

interface BookingDay {
  name: BookingDayName;
  bookings: Booking[];
}

export interface PersonBookings {
  employeeId: string;
  name: string;
  bgColor: BgColor;
  days: BookingDay[];
}

export interface Building {
  uuid: string;
  displayName: string;
  address?: {
    street: string;
    postcode: string;
    town: string;
  };
}
