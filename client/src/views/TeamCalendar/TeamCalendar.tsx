/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { useDaysEvents } from '../../hooks/events';
import dayjs from 'dayjs';
import { FullPageSpinner } from '../../components/Library';
import { useContext, useEffect, useState } from 'react';
import FilterBar from '../../components/FilterBar/FilterBar';
import { Employee } from '../../types/Employee';
import { EmployeeRessource } from '../../types/Ressource';
import { UserDateContext } from '../../providers/UserDate';
import { useFilter } from '../../hooks/useFilter';
import { Flex } from '@chakra-ui/react';

function TeamCalendar(): JSX.Element {
  const { currentTeam } = useFilter();
  const { currentDate } = useContext(UserDateContext);
  const [ calendarDate, setCalendarDate ] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading, rawEvents } = useDaysEvents(calendarDate);

  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);

  const teamMembers = currentTeam?.employees;

  interface TeamMemberMapProps {
    employee: Employee;
  }
  const ressources: EmployeeRessource[] = teamMembers?.length
    ? teamMembers.map(({ employee }: TeamMemberMapProps) => ({
      uuid: employee.uuid,
      displayName: employee.firstName,
      shortDescription: employee.firstName,
      longDescription: employee.firstName + ' ' + employee.lastName,
      bgColor: employee.contract[0].bgColor,
    }))
    : [];

  if (isLoading) return <FullPageSpinner />;

  return (
    <div
      css={{
        height: '100%',
        width: '100%',
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Flex>
        <FilterBar hasTeamsFilter />
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
