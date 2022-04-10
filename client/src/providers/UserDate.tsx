// import UserContext — you'd learn how to implement this below
import React, { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

type UserDateContextType = {
  currentDate: Dayjs | undefined,
  setCurrentDate: Dispatch<SetStateAction<Dayjs>>,
}
const UserDateContext = createContext<UserDateContextType>({
  currentDate: undefined,
  setCurrentDate: () => undefined,
});

function UserDateProvider({children}:{children: any}) {

  const [currentDate, setCurrentDate] = useState(dayjs());
  const value = useMemo(() => ({ currentDate, setCurrentDate}),[currentDate]);

  return (
    <UserDateContext.Provider value={value}>
      {children}
    </UserDateContext.Provider>
  );

}

export {UserDateProvider, UserDateContext};