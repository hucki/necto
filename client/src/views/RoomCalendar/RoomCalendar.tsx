import React, { useContext } from 'react';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { Event, EventType } from '../../types/Event';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAllRooms } from '../../hooks/rooms';
import { useAllbuildings } from '../../hooks/buildings';
import { Flex } from '@chakra-ui/react';
import { useFilter } from '../../hooks/useFilter';
import FilterBar from '../../components/molecules/FilterBar/FilterBar';
import { ViewWrapper } from '../../components/atoms/Wrapper';
import { Room } from '../../types/Rooms';
import { useWeeksEvents } from '../../hooks/events';
import { UserDateContext } from '../../providers/UserDate';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function getRoomBookingsFromEvents(events: Event[]) {
  return events
    .filter((event) => event.roomId)
    .map((event) => ({
      ...event,
      ressourceId: event.roomId || '',
      title: event.employee?.alias || '',
      bgColor: event.employee?.contract[0].bgColor,
      type: 'roomBooking' as EventType,
    }));
}

function getRooms(buildingId: string, rooms: Room[]) {
  return rooms.filter((r) => r.building.uuid === buildingId);
}

function RoomCalendar(): JSX.Element {
  const { setCalendarView } = useFilter();
  setCalendarView('week');
  const { currentDate } = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading: isLoadingWeeksEvents, rawEvents: weeksEvents } =
    useWeeksEvents(calendarDate.year(), calendarDate.week());
  const { isLoading: isLoadingRooms, rooms } = useAllRooms();
  const { isLoading: isLoadingBuildings, buildings } = useAllbuildings();

  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);

  const { currentBuildingId, setCurrentBuildingId } = useFilter();

  const [ressources, setRessources] = useState<Room[]>(
    currentBuildingId ? getRooms(currentBuildingId, rooms) : []
  );

  useEffect(() => {
    if (buildings[0]?.uuid && !currentBuildingId) {
      setCurrentBuildingId(buildings[0].uuid);
    }
  }, [buildings, currentBuildingId, setCurrentBuildingId]);

  useEffect(() => {
    if (currentBuildingId) {
      setRessources(getRooms(currentBuildingId, rooms));
    }
  }, [currentBuildingId, rooms, buildings]);

  return !currentBuildingId ||
    isLoadingBuildings ||
    isLoadingRooms ||
    isLoadingWeeksEvents ? (
    <FullPageSpinner />
  ) : (
    <ViewWrapper>
      <Flex maxW={300}>
        <FilterBar hasBuildingFilter />
      </Flex>
      <CalendarContainer
        readOnly={true}
        events={getRoomBookingsFromEvents(weeksEvents)}
        ressources={ressources}
        daysRange={[
          calendarDate.startOf('week'),
          calendarDate.startOf('week').add(4, 'day'),
        ]}
        columnHeaderFormat={'dddd'}
      />
    </ViewWrapper>
  );
}

export default RoomCalendar;
