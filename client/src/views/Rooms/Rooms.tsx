/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { Event } from '../../types/Event';
import dayjs from 'dayjs';
import { Room } from '../../types/Ressource';
import { useEffect, useState } from 'react';
import { bookingsPerPerson } from '../../assets/bookingsdata';
import { useAllRooms } from '../../hooks/rooms';
import { useAllbuildings } from '../../hooks/buildings';
import { Building } from '../../types/Rooms';
import { Label, Select } from '../../components/Library';
import { Flex } from '@chakra-ui/react';

function getBookings(buildingId: string, rooms: Room[], buildings: Building[]) {
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
          if (thisRoom?.buildingId && thisRoom.buildingId === buildingId) {
            res.push({
              id: count,
              userId: person.employeeId,
              ressourceId: bookings[j].roomId,
              title: person.name,
              bgColor: person.bgColor,
              type: 'custom',
              isDiagnostic: false,
              isHomeVisit: false,
              isAllDay: false,
              isRecurring: false,
              isCancelled: false,
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
  return rooms.filter((r) => r.buildingId === buildingId);
}

function Rooms(): JSX.Element {
  const { isLoading: isLoadingRooms, error: errorRooms, rooms } = useAllRooms();
  const {
    isLoading: isLoadingBuildings,
    error: errorBuildings,
    buildings,
  } = useAllbuildings();

  const [calendarDate, setCalendarDate] = useState(dayjs('2022-01-17'));
  const [currentBuilding, setCurrentBuilding] = useState<string>(
    buildings[0]?.uuid
  );
  const [events, setEvents] = useState<Event[]>(
    getBookings(currentBuilding, rooms, buildings)
  );
  const [ressources, setRessources] = useState<Room[]>(
    getRooms(currentBuilding, rooms)
  );

  const onBuildingChangeHandler = (event: any) => {
    setCurrentBuilding(event.target.value);
  };

  useEffect(() => {
    if (buildings[0]?.uuid && !currentBuilding)
      setCurrentBuilding(buildings[0].uuid);
  }, [buildings, setCurrentBuilding]);

  useEffect(() => {
    setEvents(getBookings(currentBuilding, rooms, buildings));
    setRessources(getRooms(currentBuilding, rooms));
  }, [currentBuilding]);

  return !currentBuilding || isLoadingBuildings || isLoadingRooms ? (
    <div>pending</div>
  ) : (
    <div
      css={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Flex w={300}>
        <Label htmlFor="building">Ort</Label>
        <Select
          name="building"
          value={currentBuilding.toString()}
          onChange={onBuildingChangeHandler}
        >
          {buildings.map((b) => (
            <option key={b.uuid.toString()} value={b.uuid.toString()}>
              {b.displayName}
            </option>
          ))}
        </Select>
      </Flex>
      <CalendarContainer
        readOnly={true}
        events={events}
        ressources={ressources}
        daysRange={[calendarDate, calendarDate.add(4, 'day')]}
        columnHeaderFormat={'dddd'}
      />
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(Rooms);
