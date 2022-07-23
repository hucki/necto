/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Event } from '../../types/Event';
import classes from './Calendar.module.css';
import { FaCommentMedical, FaHouseUser, FaLink } from 'react-icons/fa';
import dayjs from 'dayjs';
import { CalendarEntryContainer } from '../Library/Event';


interface CalendarEntryProps {
  event: Event;
  readOnly: boolean;
  showTime?: boolean;
  onClickHandler: (event: Event) => void;
  styles: any;
}

export const CalendarEntry = ({
  event,
  readOnly,
  showTime = false,
  onClickHandler,
  styles,
}: CalendarEntryProps) => {
  const [icons, setIcons] = useState<JSX.Element[] | []>([]);
  useEffect(() => {
    setIcons([]);
    if (event.isHomeVisit)
      setIcons((icons) => [...icons, <FaHouseUser key="homeVisitIcon" />]);
    if (event.rrule !== '')
      setIcons((icons) => [...icons, <FaLink key="rruleIcon" />]);
    if (event.isDiagnostic)
      setIcons((icons) => [...icons, <FaCommentMedical key="isDiagnostic" />]);
      // setIcons((icons) => [...icons, <span key="isDiagnostic" style={{color: 'red'}}>D</span>]);
  }, [event]);

  const timeString = `${dayjs(event.startTime).format('HH:mm')} -
  ${dayjs(event.endTime).format('HH:mm')}`;
  const startTimeString = `${dayjs(event.startTime).format('HH:mm')}`;

  const entryTitle = event.patient ? event.patient.lastName + ', ' +  event.patient.firstName : event.title;
  const isNote = event.type === 'note';
  return (
    <CalendarEntryContainer
      bgColor={isNote ? 'note' : event.bgColor}
      title={startTimeString + ' ' + event.title}
      key={event.uuid?.toString()}
      onClick={readOnly ? undefined : () => onClickHandler(event)}
      className={`${
        readOnly ? 'read-only' : ''
      }`}
      style={styles}
    >
      <div className={classes.icon_container}>
        {!isNote && showTime && <span className={classes.event_time}>{startTimeString}</span>}
        <span style={{display: 'flex', flexDirection: 'row'}}>{icons}</span>
      </div>
      <div className={classes.event_container}>
        <span className={classes.event_info}>{entryTitle}</span>
      </div>
    </CalendarEntryContainer>
  );
};
