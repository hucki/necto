/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { Event } from '../../types/Event';
import dayjs, { Dayjs } from 'dayjs';
import { Ressource } from '../../types/Ressource';
import { useState } from 'react';
import { bookingsPerPerson, rooms } from '../../assets/bookingsdata';

interface RoomsInputProps {
  currentDate?: Dayjs;
}

function getBookings() {
  const createBookings = () => {
    const res = [];
    const day2date = {
      monday: '17.01.2022',
      tuesday: '18.01.2022',
      wednesday: '19.01.2022',
      thursday: '20.01.2022',
      friday: '21.01.2022',
    };
    let count = 1;
    for (let l = 0; l < bookingsPerPerson.length; l++) {
      const person = bookingsPerPerson[l];
      for (let i = 0; i < person.days.length; i++) {
        const bookings = person.days[i].bookings;
        for (let j = 0; j < bookings.length; j++) {
          console.log(person.days[i].name);
          res.push({
            id: count,
            userId: person.userId,
            ressourceId: bookings[j].roomId,
            title: person.name,
            bgColor: person.bgColor,
            type: 'string',
            isHomeVisit: false,
            isAllDay: false,
            isRecurring: false,
            isCancelled: false,
            isCancelledReason: 'string',
            rrule: 'string',
            startTime: dayjs(
              day2date[person.days[i].name] + ' ' + bookings[j].start,
              'DD.MM.YYYY HH:mm'
            ),
            endTime: dayjs(
              day2date[person.days[i].name] + ' ' + bookings[j].end,
              'DD.MM.YYYY HH:mm'
            ),
            createdAt: dayjs().toDate(),
            updatedAt: undefined,
          });
          count++;
        }
      }
    }
    return res;
  };

  const bookings: Event[] = createBookings();

  return bookings;
}

function getRooms(building: number) {
  return rooms.filter((r) => r.building === building);
}

function Rooms({ currentDate }: RoomsInputProps): JSX.Element {
  const [calendarDate, setCalendarDate] = useState(
    dayjs('17.01.2022', 'DD.MM.YYYY')
  );

  const rawEvents = getBookings();
  const ressources: Ressource[] = getRooms(1);

  return (
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
      <CalendarContainer
        readOnly={true}
        events={rawEvents}
        ressources={ressources}
        daysRange={[calendarDate, calendarDate.add(4, 'day')]}
        useWeekdayAsHeader
      />
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(Rooms);
