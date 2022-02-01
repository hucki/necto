/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled/macro';
import { useEffect, useState } from 'react';
import { Event } from '../../types/Event';
import classes from './Calendar.module.css';
import { FaHouseUser, FaLink } from 'react-icons/fa';
import dayjs from 'dayjs';

const CalendarEntryContainer = styled.div({
  // minHeight: 'min-content'
  // backgroundColor: 'white',
});

interface CalendarEntryProps {
  event: Event;
  readOnly: boolean;
  onClickHandler: (event: Event) => void;
  styles: any;
}

export const CalendarEntry = ({
  event,
  readOnly,
  onClickHandler,
  styles,
}: CalendarEntryProps) => {
  const [icons, setIcons] = useState<JSX.Element[] | []>([]);
  useEffect(() => {
    setIcons([]);
    if (event.isHomeVisit)
      setIcons((icons) => [
        ...icons,
        <FaHouseUser key="homeVisitIcon" />,
      ]);
    if (event.rrule !== '')
      setIcons((icons) => [
        ...icons,
        <FaLink key="rruleIcon" />,
      ]);
  }, [event]);

  return (
    <CalendarEntryContainer
      title={event.title}
      key={event.uuid?.toString()}
      onClick={readOnly ? undefined : () => onClickHandler(event)}
      className={`${classes.event} ${classes['bg_' + event.bgColor]} ${
        readOnly ? 'read-only' : ''
      }`}
      style={styles}
    >
      <div className={classes.event_container}>
        <span className={classes.event_info}>{event.title}</span>
        <div className={classes.icon_container}>{icons}</div>
      </div>
      {/* <span className={classes.event_info}>
        {dayjs(event.startTime).format('HH:mm')} -{' '}
        {dayjs(event.endTime).format('HH:mm')}
      </span> */}
    </CalendarEntryContainer>
  );
};
