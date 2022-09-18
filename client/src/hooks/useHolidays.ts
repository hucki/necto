import dayjs, { Dayjs } from 'dayjs';
import Holidays from 'date-holidays';

export function useHolidays() {
  const nrwHolidays = new Holidays('DE', 'NW');
  type DateInputProps = {
    date: Dayjs;
  };

  const isHoliday = ({ date }: DateInputProps) => {
    const checkIsHoliday = nrwHolidays.isHoliday(new Date(date.toString()));
    const holidayNames =
      checkIsHoliday && checkIsHoliday.length
        ? checkIsHoliday.map((hd) => hd.name)
        : false;
    return holidayNames;
  };

  const isPublicHoliday = ({ date }: DateInputProps): false | string[] => {
    const checkIsHoliday = nrwHolidays.isHoliday(new Date(date.toString()));
    const holidayNames =
      checkIsHoliday && checkIsHoliday.length
        ? checkIsHoliday
            .filter((hd) => hd.type === 'public')
            .map((hd) => hd.name)
        : false;
    return holidayNames && holidayNames.length ? holidayNames : false;
  };

  const isWeekend = ({ date }: DateInputProps) => {
    return dayjs(date).day() === 0 || dayjs(date).day() === 6;
  };

  return {
    isWeekend,
    isHoliday,
    isPublicHoliday,
  };
}
