import React from 'react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { useDaysEvents } from '../../hooks/events';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import FilterBar from '../../components/molecules/FilterBar/FilterBar';
import { Employee } from '../../types/Employee';
import { EmployeeRessource } from '../../types/Ressource';
import { UserDateContext } from '../../providers/UserDate';
import { useFilter } from '../../hooks/useFilter';
import { Flex } from '@chakra-ui/react';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function TeamCalendar(): JSX.Element {
  const { currentTeam } = useFilter();
  const { currentDate } = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading, rawEvents } = useDaysEvents(calendarDate);

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
    ? teamMembers.map(({ employee }: TeamMemberMapProps) => ({
        uuid: employee.uuid,
        displayName: employee.alias || employee.firstName,
        shortDescription: employee.firstName,
        longDescription: employee.firstName + ' ' + employee.lastName,
        bgColor: employee.contract[0].bgColor,
      }))
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
        <FilterBar hasTeamsFilter hasCalendarOption />
      </Flex>
      <CalendarContainer
        readOnly={false}
        events={rawEvents}
        ressources={ressources}
        daysRange={[calendarDate, calendarDate]}
      />
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(TeamCalendar);
