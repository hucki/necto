import React from 'react';
import { useEffect, useState } from 'react';
import { Event } from '../../../types/Event';
import {
  FaCommentMedical,
  FaExclamation,
  FaHouseUser,
  FaLink,
  FaPlane,
  FaPlaneDeparture,
} from 'react-icons/fa';
import dayjs from 'dayjs';
import {
  CalendarEntryContainer,
  CalendarEntryContent,
  CalendarEntryIconContainer,
  CalendarEntryTime,
} from '../../Library/Event';
import { t } from 'i18next';
import { useViewport } from '../../../hooks/useViewport';
import { OnClickCalendarEventProps } from './CalendarColumn';

interface CalendarEntryProps {
  event: Event;
  readOnly: boolean;
  showTime?: boolean;
  onClickHandler: ({ e, event }: OnClickCalendarEventProps) => void;
  styles: any;
}

export const CalendarEntry = ({
  event,
  readOnly,
  showTime = false,
  onClickHandler,
  styles,
}: CalendarEntryProps) => {
  const { isMobile } = useViewport();
  const [icons, setIcons] = useState<JSX.Element[] | []>([]);
  useEffect(() => {
    setIcons([]);
    if (event.patient && !event.patient.hasContract) {
      setIcons((icons) => [
        ...icons,
        <FaExclamation key="noContractIcon" color="red" />,
      ]);
    }
    if (event.isHomeVisit) {
      setIcons((icons) => [...icons, <FaHouseUser key="homeVisitIcon" />]);
    }
    if (!isLeave && event.rrule !== '') {
      setIcons((icons) => [...icons, <FaLink key="rruleIcon" />]);
    }
    if (event.isDiagnostic) {
      setIcons((icons) => [...icons, <FaCommentMedical key="isDiagnostic" />]);
    }
    if (event.type === 'leave') {
      if (event.leaveType === 'paidVacation') {
        setIcons((icons) => [
          ...icons,
          isFirstDay ? (
            <FaPlaneDeparture key="isVacation" color="green" />
          ) : (
            <FaPlane key="isVacation" color="green" />
          ),
        ]);
      }
      if (event.leaveType === 'sick' || event.leaveType === 'sickChild') {
        setIcons((icons) => [
          ...icons,
          <FaCommentMedical key="isSick" color="blue" />,
        ]);
      }
      if (!isMobile && event.rrule !== '' && !event.parentEventId) {
        setIcons((icons) => [
          ...icons,
          <span
            key="untilDate"
            style={{ color: 'black', paddingLeft: '0.25rem' }}
          >
            {' bis '}
            {dayjs(event.endTime).format('DD.MM.')}
          </span>,
        ]);
      }
    }
    // setIcons((icons) => [...icons, <span key="isDiagnostic" style={{color: 'red'}}>D</span>]);
  }, [event]);

  const timeString = `${dayjs(event.startTime).format('HH:mm')} - ${dayjs(
    event.endTime
  ).format('HH:mm')}`;
  const startTimeString = `${dayjs(event.startTime).format('HH:mm')}`;

  const isNote = event.type === 'note';
  const isLeave = event.type === 'leave';
  const isFirstDay = event.rrule === '' || !event.parentEventId;
  const isApproved = event.leaveStatus === 'approved';
  const isDone = event.isDone;
  const entryTitle = isLeave
    ? t(`calendar.leave.type.${event.leaveType}`) +
      (event.leaveStatus === 'requested'
        ? ' (' + t(`calendar.leave.status.${event.leaveStatus}`) + ')'
        : '')
    : event.patient
    ? event.patient.lastName + ', ' + event.patient.firstName
    : event.title;
  return (
    <CalendarEntryContainer
      checked={(isLeave && isApproved) || (!isLeave && isDone)}
      bgColor={isLeave ? 'leave' : isNote ? 'note' : event.bgColor}
      title={!isLeave ? startTimeString + ' ' + entryTitle : entryTitle}
      key={event.uuid?.toString()}
      id={'calEntry-' + event.uuid?.toString()}
      onClick={readOnly ? undefined : (e) => onClickHandler({ e, event })}
      className={`${readOnly ? 'read-only' : ''}`}
      style={styles}
    >
      <CalendarEntryIconContainer>
        {!isNote && !isLeave && showTime && (
          <CalendarEntryTime>{startTimeString}</CalendarEntryTime>
        )}
        <span style={{ display: 'flex', flexDirection: 'row' }}>{icons}</span>
      </CalendarEntryIconContainer>
      <CalendarEntryContent strikeThrough={isNote && isDone}>
        {entryTitle}
      </CalendarEntryContent>
    </CalendarEntryContainer>
  );
};
