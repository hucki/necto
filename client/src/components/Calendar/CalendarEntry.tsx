import React from 'react';
import { useEffect, useState } from 'react';
import { Event } from '../../types/Event';
import { FaCommentMedical, FaHouseUser, FaLink } from 'react-icons/fa';
import dayjs from 'dayjs';
import { CalendarEntryContainer, CalendarEntryContent, CalendarEntryIconContainer, CalendarEntryTime } from '../Library/Event';
import { Icon } from '@chakra-ui/react';
import { RiCheckFill } from 'react-icons/ri';


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

  const timeString = `${dayjs(event.startTime).format('HH:mm')} - ${dayjs(event.endTime).format('HH:mm')}`;
  const startTimeString = `${dayjs(event.startTime).format('HH:mm')}`;

  const entryTitle = event.patient ? event.patient.lastName + ', ' +  event.patient.firstName : event.title;
  const isNote = event.type === 'note';
  const isDone = event.isDone;
  return (
    <CalendarEntryContainer
      bgColor={isNote ? 'note' : event.bgColor}
      title={startTimeString + ' ' + entryTitle}
      key={event.uuid?.toString()}
      onClick={readOnly ? undefined : () => onClickHandler(event)}
      className={`${
        readOnly ? 'read-only' : ''
      }`}
      style={styles}
    >
      <CalendarEntryIconContainer>
        {!isNote && showTime &&
          <CalendarEntryTime>
            {isDone && <Icon as={RiCheckFill} w={4} h={4} fill="green"/>}
            {startTimeString}
          </CalendarEntryTime>
        }
        <span style={{display: 'flex', flexDirection: 'row'}}>{icons}</span>
      </CalendarEntryIconContainer>
      <CalendarEntryContent strikeThrough={isNote && isDone} >
        {entryTitle}
      </CalendarEntryContent>
    </CalendarEntryContainer>
  );
};
