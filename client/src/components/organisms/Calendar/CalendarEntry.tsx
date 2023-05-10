import React from 'react';
import { useEffect, useState } from 'react';
import { Event, isLeave } from '../../../types/Event';
import dayjs from 'dayjs';
import {
  CalendarEntryContainer,
  CalendarEntryContent,
  CalendarEntryIconContainer,
  CalendarEntryTime,
} from '../../Library/Event';
import { t } from 'i18next';
import { useViewport } from '../../../hooks/useViewport';
import { ItemStyle, OnClickCalendarEventProps } from './CalendarColumn';
import { EventIcon } from '../../molecules/DataDisplay/Icons';
import { BgColor } from '../../../types/Colors';

interface CalendarEntryProps {
  event: Event;
  readOnly: boolean;
  showTime?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClickHandler: ({ e, event }: OnClickCalendarEventProps) => void;
  styles: ItemStyle;
  bgColor?: BgColor;
}

export const CalendarEntry = ({
  event,
  readOnly,
  showTime = false,
  onClickHandler,
  styles,
  bgColor,
}: CalendarEntryProps) => {
  const { isMobile } = useViewport();
  const [icons, setIcons] = useState<JSX.Element[] | []>([]);
  useEffect(() => {
    setIcons([]);
    if (event.isHomeVisit) {
      setIcons((icons) => [
        ...icons,
        <EventIcon type="homeVisit" size="s" key="homeVisitIcon" />,
      ]);
    }
    if (!isLeave(event) && event.rrule !== '') {
      setIcons((icons) => [
        ...icons,
        <EventIcon type="recurring" size="s" key="rruleIcon" />,
      ]);
    }
    if (event.isDiagnostic) {
      setIcons((icons) => [
        ...icons,
        <EventIcon type="diagnostic" size="s" key="diagnosticIcon" />,
      ]);
    }
    if (event.type === 'leave') {
      if (event.leaveType === 'paidVacation') {
        setIcons((icons) => [
          ...icons,
          <EventIcon
            type={`vacation${isFirstDay ? 'FirstDay' : ''}`}
            size="s"
            key="vacation"
          />,
        ]);
      }
      if (event.leaveType === 'sick' || event.leaveType === 'sickChild') {
        setIcons((icons) => [
          ...icons,
          <EventIcon type="sick" key="isSick" size="s" />,
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
  }, [event]);

  const fullTimeString = `${dayjs(event.startTime).format('HH:mm')} - ${dayjs(
    event.endTime
  ).format('HH:mm')}`;

  const isNote = event.type === 'note';
  const isRoomBooking = event.type === 'roomBooking';
  const isFirstDay = event.rrule === '' || !event.parentEventId;
  const isApproved = event.leaveStatus === 'approved';
  const isDone = event.isDone;
  const entryTitle = isRoomBooking
    ? event.title
    : isLeave(event)
    ? t(`calendar.leave.type.${event.leaveType}`) +
      (event.leaveStatus === 'requested'
        ? ' (' + t(`calendar.leave.status.${event.leaveStatus}`) + ')'
        : '')
    : event.patient
    ? event.patient.lastName + ', ' + event.patient.firstName
    : event.title;
  return (
    <CalendarEntryContainer
      checked={(isLeave(event) && isApproved) || (!isLeave(event) && isDone)}
      bgColor={
        isLeave(event) ? 'leave' : isNote ? 'note' : bgColor || event.bgColor
      }
      title={!isLeave(event) ? fullTimeString + ' ' + entryTitle : entryTitle}
      key={event.uuid?.toString()}
      id={'calEntry-' + event.uuid?.toString()}
      onClick={readOnly ? undefined : (e) => onClickHandler({ e, event })}
      className={`${readOnly ? 'read-only' : ''}`}
      style={styles}
    >
      <CalendarEntryContent
        strikeThrough={isNote && isDone}
        isMobile={isMobile}
      >
        {!isRoomBooking && event.patient && !event.patient.hasContract && (
          <EventIcon type="noContract" size="s" />
        )}
        <span
          style={{
            marginLeft:
              !isRoomBooking && event.patient && !event.patient.hasContract
                ? undefined
                : '0.2rem',
          }}
        >
          {entryTitle}
        </span>
      </CalendarEntryContent>
      <CalendarEntryIconContainer>
        {!isNote && !isLeave(event) && showTime && (
          <CalendarEntryTime>{fullTimeString}</CalendarEntryTime>
        )}
        {!isRoomBooking && (
          <span style={{ display: 'flex', flexDirection: 'row' }}>{icons}</span>
        )}
      </CalendarEntryIconContainer>
    </CalendarEntryContainer>
  );
};
