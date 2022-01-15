import { BgColor } from './Colors';

interface Booking {
  roomId: number;
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
  userId: number;
  name: string;
  bgColor: BgColor;
  days: BookingDay[];
}
