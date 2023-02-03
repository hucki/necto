import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

export type GoToTarget =
  | 'previousDay'
  | 'previousWeek'
  | 'nextDay'
  | 'nextWeek';

type UserDateContextType = {
  currentDate: Dayjs;
  setCurrentDate: Dispatch<SetStateAction<Dayjs>>;
  // eslint-disable-next-line no-unused-vars
  goTo: (target: GoToTarget) => void;
};

const UserDateContext = createContext<UserDateContextType>({
  currentDate: dayjs(),
  setCurrentDate: () => undefined,
  goTo: () => undefined,
});

function UserDateProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const goTo = (target: GoToTarget) => {
    switch (target) {
      case 'previousWeek':
        setCurrentDate(dayjs(currentDate).subtract(1, 'week'));
        break;
      case 'previousDay':
        setCurrentDate(dayjs(currentDate).subtract(1, 'day'));
        break;
      case 'nextWeek':
        setCurrentDate(dayjs(currentDate).add(1, 'week'));
        break;
      case 'nextDay':
        setCurrentDate(dayjs(currentDate).add(1, 'day'));
        break;
      default:
        break;
    }
  };

  const value = useMemo(
    () => ({ currentDate, setCurrentDate, goTo }),
    [currentDate]
  );

  return (
    <UserDateContext.Provider value={value}>
      {children}
    </UserDateContext.Provider>
  );
}

export { UserDateProvider, UserDateContext };
