import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

function msUntilNext() {
  return dayjs().startOf('second').add(1,'second').diff(dayjs(),'milliseconds');
}

export function useCurrentTime() {
  const [date, setDate] = useState(dayjs());
  const timer = useRef<number>(0);

  useEffect(() => {
    function delayedTimeChange() {
      timer.current = setTimeout(() => {
        delayedTimeChange();
      }, msUntilNext()) as unknown as number;

      setDate(dayjs());
    }

    delayedTimeChange();
    return () => clearTimeout(timer.current);
  }, []);

  return {
    date,
    hours: date.hour(),
    minutes: date.minute(),
    seconds: date.second(),
    time: date.format('HH:mm:ss'),
  };
}