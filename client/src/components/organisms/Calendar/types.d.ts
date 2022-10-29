type CalenderEventViewProps = {
  isNote: boolean;
  eventTitle: Event['title'];
  isHomeVisit: Event['isHomeVisit'];
  isRecurring: Event['isRecurring'];
  isDiagnostic: Event['isDiagnostic'];
  eventStartTime: Event['startTime'];
  eventEndTime: Event['endTime'];
  eventPatient: Event['patient'];
};

type ReactDatePickerReturnType = Date | [Date | null, Date | null] | null;

type RecurringFrequency = 'WEEKLY' | 'MONTHLY' | 'BIWEEKLY';
type RecurringInterval =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

type CalendarColumnHeaderFormat =
  | 'DD.'
  | 'DD.MM.'
  | 'dd DD.MM.'
  | 'dddd'
  | 'dddd DD.MM.';

type CalendarColumnSubHeaderContent = 'dd' | 'dddd' | 'ressource';