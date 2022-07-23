// import UserContext — you'd learn how to implement this below
import React, { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

export type GoToTarget = 'previousDay' | 'previousWeek' | 'nextDay' | 'nextWeek'

type UserDateContextType = {
  currentDate: Dayjs | undefined,
  setCurrentDate: Dispatch<SetStateAction<Dayjs>>,
  goTo: (target: GoToTarget) => void
}

const UserDateContext = createContext<UserDateContextType>({
  currentDate: undefined,
  setCurrentDate: () => undefined,
  goTo: (target) => undefined,
});

function UserDateProvider({children}:{children: any}) {

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
    };
  };

  const value = useMemo(() => ({ currentDate, setCurrentDate, goTo}),[currentDate]);

  return (
    <UserDateContext.Provider value={value}>
      {children}
    </UserDateContext.Provider>
  );

}

export {UserDateProvider, UserDateContext};