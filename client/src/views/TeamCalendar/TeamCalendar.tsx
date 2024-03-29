import React from 'react';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { useEvents } from '../../hooks/events';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import FilterBar from '../../components/molecules/FilterBar/FilterBar';
import { Employee } from '../../types/Employee';
import { EmployeeRessource } from '../../types/Ressource';
import { UserDateContext } from '../../providers/UserDate';
import { useFilter } from '../../hooks/useFilter';
import { Flex } from '@chakra-ui/react';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import { AuthContext } from '../../providers/AuthProvider';
import { MinimalUser } from '../../types/Auth';
import { getContractOfCurrentMonth } from '../../helpers/contract';

function TeamCalendar(): JSX.Element {
  const { user } = useContext(AuthContext);
  const { currentTeam, setCalendarView } = useFilter();
  const isAuthorized = (user: MinimalUser) => {
    if (!user.roles) return false;
    if (user.roles?.find((role) => role === 'admin' || role === 'planner'))
      return true;
    return false;
  };
  const { currentDate } = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading, rawEvents } = useEvents({
    date: calendarDate,
    includes: 'patient,parentEvent,childEvents,room,employee',
  });

  useEffect(() => {
    setCalendarView('day');
  }, []);
  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);

  const teamMembers = currentTeam?.employees?.filter(
    ({ employee }: TeamMemberMapProps) => {
      return employee.contract.length > 0;
    }
  );

  interface TeamMemberMapProps {
    employee: Employee;
  }
  const ressources: EmployeeRessource[] = teamMembers?.length
    ? teamMembers.map(({ employee }: TeamMemberMapProps) => {
        const contract = getContractOfCurrentMonth(
          employee,
          calendarDate.year(),
          calendarDate.month()
        );
        return {
          uuid: employee.uuid,
          displayName: employee.alias || employee.firstName,
          shortDescription: employee.firstName,
          longDescription: employee.firstName + ' ' + employee.lastName,
          bgColor: contract.bgColor || 'green',
          roomId: contract.roomId || '',
        };
      })
    : [];

  if (isLoading) return <FullPageSpinner />;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Flex>
        <FilterBar hasTeamsFilter hasEventTypeOption />
      </Flex>
      <CalendarContainer
        readOnly={!user || !isAuthorized(user) ? true : false}
        events={rawEvents}
        ressources={ressources}
        daysRange={[calendarDate, calendarDate]}
      />
    </div>
  );
}

export default TeamCalendar;
