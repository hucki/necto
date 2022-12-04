import React from 'react';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { Event, EventType } from '../../types/Event';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { bookingsPerPerson } from '../../assets/bookingsdata';
import { useAllRooms } from '../../hooks/rooms';
import { useAllbuildings } from '../../hooks/buildings';
import { Flex } from '@chakra-ui/react';
import { useFilter } from '../../hooks/useFilter';
import FilterBar from '../../components/molecules/FilterBar/FilterBar';
import { ViewWrapper } from '../../components/atoms/Wrapper';
import { Room } from '../../types/Rooms';
import { useDaysEvents } from '../../hooks/events';

function getBookings(buildingId: string, rooms: Room[]) {
  const createBookings = () => {
    const res = [];
    const day2date = {
      monday: '2022-01-17',
      tuesday: '2022-01-18',
      wednesday: '2022-01-19',
      thursday: '2022-01-20',
      friday: '2022-01-21',
    };
    let count = 1;
    for (let l = 0; l < bookingsPerPerson.length; l++) {
      const person = bookingsPerPerson[l];
      for (let i = 0; i < person.days.length; i++) {
        const bookings = person.days[i].bookings;
        for (let j = 0; j < bookings.length; j++) {
          const thisRoom = rooms.filter(
            (room) => room.uuid === bookings[j].roomId
          )[0];
          if (thisRoom?.building && thisRoom.building.uuid === buildingId) {
            res.push({
              uuid: '',
              id: count,
              userId: person.employeeId,
              ressourceId: bookings[j].roomId,
              title: person.name,
              bgColor: person.bgColor,
              type: 'roomBooking' as EventType,
              isDiagnostic: false,
              isHomeVisit: false,
              isAllDay: false,
              isRecurring: false,
              isCancelled: false,
              isDone: false,
              isCancelledReason: '',
              rrule: '',
              startTime: dayjs(
                day2date[person.days[i].name] + ' ' + bookings[j].start
              ),
              endTime: dayjs(
                day2date[person.days[i].name] + ' ' + bookings[j].end
              ),
              createdAt: dayjs().toDate(),
              updatedAt: undefined,
            });
            count++;
          }
        }
      }
    }
    return res;
  };

  const bookings: Event[] = createBookings();
  return bookings;
}

function getRooms(buildingId: string, rooms: Room[]) {
  return rooms.filter((r) => r.building.uuid === buildingId);
}

function RoomCalendar(): JSX.Element {
  const { isLoading: isLoadingRooms, rooms } = useAllRooms();
  const { isLoading: isLoadingBuildings, buildings } = useAllbuildings();
  const [calendarDate] = useState(dayjs('2022-01-17'));
  const { isLoading, rawEvents } = useDaysEvents(calendarDate);
  console.log({ rawEvents, calendarDate });

  const { currentBuildingId, setCurrentBuildingId } = useFilter();

  const [events, setEvents] = useState<Event[]>(() =>
    currentBuildingId ? getBookings(currentBuildingId, rooms) : []
  );
  const [ressources, setRessources] = useState<Room[]>(
    currentBuildingId ? getRooms(currentBuildingId, rooms) : []
  );

  useEffect(() => {
    if (buildings[0]?.uuid && !currentBuildingId) {
      setCurrentBuildingId(buildings[0].uuid);
    }
  }, [buildings, currentBuildingId, setCurrentBuildingId, events]);

  useEffect(() => {
    if (currentBuildingId) {
      setEvents(getBookings(currentBuildingId, rooms));
    }
    if (currentBuildingId) {
      setRessources(getRooms(currentBuildingId, rooms));
    }
  }, [currentBuildingId, rooms, buildings]);

  return !currentBuildingId || isLoadingBuildings || isLoadingRooms ? (
    <div>pending</div>
  ) : (
    <ViewWrapper>
      <Flex maxW={300}>
        <FilterBar hasBuildingFilter />
      </Flex>
      <CalendarContainer
        readOnly={true}
        events={rawEvents}
        ressources={ressources}
        daysRange={[calendarDate, calendarDate.add(4, 'day')]}
        columnHeaderFormat={'dddd'}
      />
    </ViewWrapper>
  );
}

export default RoomCalendar;
