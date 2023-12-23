import React, { useContext } from 'react';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { Event } from '../../types/Event';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAllRooms } from '../../hooks/rooms';
import { useAllbuildings } from '../../hooks/buildings';
import { Flex } from '@chakra-ui/react';
import { useFilter } from '../../hooks/useFilter';
import FilterBar from '../../components/molecules/FilterBar/FilterBar';
import { ViewWrapper } from '../../components/atoms/Wrapper';
import { Room } from '../../types/Rooms';
import { useEvents } from '../../hooks/events';
import { UserDateContext } from '../../providers/UserDate';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import { Employee } from '../../types/Employee';

function combineRoomBookings(events: Event[]): Event[] {
  const eventsPerEmployee: {
    employyeeId: Employee['uuid'];
    events: Event[];
  }[] = [];
  const roomBookings: Event[] = events.map((event) => ({
    ...event,
    ressourceId: event.roomId || '',
    title: event.employee?.alias || '',
    bgColor: event.employee?.contract[0].bgColor,
    type: 'roomBooking',
  }));
  for (let i = 0; i < roomBookings.length; i++) {
    const currentList = eventsPerEmployee.find(
      (list) => list.employyeeId === roomBookings[i].employee?.uuid
    );
    if (currentList) {
      currentList.events.push(roomBookings[i]);
    } else {
      eventsPerEmployee.push({
        employyeeId: roomBookings[i].employee?.uuid || '',
        events: [roomBookings[i]],
      });
    }
  }
  for (let i = 0; i < eventsPerEmployee.length; i++) {
    eventsPerEmployee[i] = {
      ...eventsPerEmployee[i],
      events: eventsPerEmployee[i].events
        .sort((a, b) =>
          a.startTime < b.startTime ? -1 : a.startTime === b.startTime ? 0 : 1
        )
        .reduce((prev, cur, i) => {
          if (i === 0) {
            prev.push(cur);
          } else {
            const lastIndex = prev.length - 1;
            if (
              cur.roomId !== prev[lastIndex].roomId ||
              !dayjs(cur.startTime).isSame(
                dayjs(prev[lastIndex].startTime),
                'day'
              )
            ) {
              prev.push(cur);
            } else if (
              dayjs(cur.startTime).diff(
                dayjs(prev[lastIndex].endTime),
                'minutes'
              ) < 30
            ) {
              prev[lastIndex].endTime = cur.endTime;
            } else {
              prev.push(cur);
            }
          }
          return prev;
        }, [] as Event[]),
    };
  }
  return eventsPerEmployee.reduce((prev, cur) => {
    prev.push(...cur.events);
    return prev;
  }, [] as Event[]);
}

function getRooms(buildingId: string, rooms: Room[]) {
  return rooms.filter((r) => r.building.uuid === buildingId);
}

function RoomCalendar(): JSX.Element {
  const { setCalendarView } = useFilter();
  const { currentDate } = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading: isLoadingWeeksEvents, rawEvents: weeksEvents } = useEvents(
    {
      year: calendarDate.year(),
      week: calendarDate.week(),
      roomId: 'IS NOT NULL',
      includes: 'room,employee',
    }
  );

  const { isLoading: isLoadingRooms, rooms } = useAllRooms();
  const { isLoading: isLoadingBuildings, buildings } = useAllbuildings();
  setCalendarView('week');
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
        events={combineRoomBookings(weeksEvents)}
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
