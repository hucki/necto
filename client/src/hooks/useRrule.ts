import { Options, RRule, RRuleSet } from 'rrule';
import { useHolidays } from '../hooks/useHolidays';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type RruleState = {
  rruleOptions: Partial<Options>;
  exdates: Date[];
  skippedHolidays: string[];
  rruleString: string;
};
export const useRrule = () => {
  const { isPublicHoliday } = useHolidays();
  const [rruleState, setRruleState] = useState<RruleState>(() => ({
    rruleOptions: {},
    exdates: [],
    skippedHolidays: [],
    rruleString: '',
  }));
  const [isPending, setIsPending] = useState<boolean>(false);
  const { rruleOptions, rruleString, skippedHolidays } = rruleState;

  const setRruleOptions = (options: Partial<Options>) => {
    setRruleState((cur) => ({
      ...cur,
      rruleOptions: { ...cur.rruleOptions, ...options },
    }));
  };

  useEffect(() => {
    if (!Boolean(rruleOptions.dtstart)) {
      return;
    }
    if (rruleOptions && !isPending) {
      updateRruleString({ options: rruleOptions });
    }
  }, [rruleOptions, isPending]);

  const getPublicHolidays = (rruleSet: RRuleSet) => {
    setIsPending(true);
    const currentExdates: Date[] = [];
    const currentSkippedHolidays: string[] = [];
    const allDates = rruleSet.all();
    let numOfPublicHolidays = 0;
    for (let i = 0; i < allDates.length; i++) {
      const isDateHoliday = isPublicHoliday({ date: dayjs.utc(allDates[i]) });
      if (isDateHoliday) {
        for (let i = 0; i < isDateHoliday.length; i++) {
          currentSkippedHolidays.push(isDateHoliday[i]);
        }
        currentExdates.push(dayjs.utc(allDates[i]).toDate());
        setRruleState((cur) => ({
          ...cur,
          exdates: [...cur.exdates, dayjs.utc(allDates[i]).toDate()],
        }));
        numOfPublicHolidays++;
      }
    }
    if (currentSkippedHolidays.length) {
      setRruleState((cur) => ({
        ...cur,
        skippedHolidays: [...currentSkippedHolidays],
      }));
    }
    setIsPending(false);
    return { numOfPublicHolidays, currentExdates, currentSkippedHolidays };
  };

  type GetRruleStringProps = {
    options: Partial<Options>;
  };
  const updateRruleString = ({ options }: GetRruleStringProps) => {
    setIsPending(true);
    const rrule = new RRule(options);
    const rruleSet = new RRuleSet();
    rruleSet.rrule(rrule);
    const { numOfPublicHolidays, currentExdates } = getPublicHolidays(rruleSet);
    if (!numOfPublicHolidays) {
      setRruleState((cur) => ({
        ...cur,
        rruleString: rruleSet.toString(),
      }));
    } else {
      const rruleWithExdates = new RRule({
        ...options,
        count: numOfPublicHolidays + (options.count || 0),
      });
      const rruleSetWithExdates = new RRuleSet();
      rruleSetWithExdates.rrule(rruleWithExdates);
      for (let i = 0; i < currentExdates.length; i++) {
        rruleSetWithExdates.exdate(currentExdates[i]);
      }
      setRruleState((cur) => ({
        ...cur,
        rruleString: rruleSetWithExdates.toString(),
      }));
    }
    setIsPending(false);
  };

  return { skippedHolidays, setRruleOptions, isPending, rruleString };
};
