import React, { useEffect, useState } from 'react';
import classes from '../Teamtable.module.css';
import { Modal, message } from 'antd';
import dayjs from 'dayjs';
import { HomeTwoTone, ApiTwoTone } from '@ant-design/icons';
import { useDeleteEvent } from '../../../hooks/events';
import { Event } from '../../../types/Event';

interface TeamtableItemInputProps {
  event: Event;
  styles: any;
  readOnly: boolean;
}

const TeamtableItem = ({
  event,
  styles,
  readOnly = false,
}: TeamtableItemInputProps) => {
  // TODO: put delete dialog in a separate Component
  const { confirm } = Modal;
  const [icons, setIcons] = useState<JSX.Element[] | []>([]);
  const [deleteEvent] = useDeleteEvent();

  useEffect(() => {
    setIcons([]);
    if (event.rrule !== '')
      setIcons(() => [...icons, <ApiTwoTone key="rruleIcon" />]);
    if (event.isHomeVisit)
      setIcons(() => [...icons, <HomeTwoTone key="homeVisitIcon" />]);
  }, [event]);

  const onClickHandler = () => {
    confirm({
      content: (
        <div>
          <p>Delete Appointment id: {event.uuid}?</p>
          <p>
            {dayjs(event.startTime).format('HH:mm')} -{' '}
            {dayjs(event.endTime).format('HH:mm')}: <b>{event.title}</b>
          </p>
        </div>
      ),
      onOk() {
        if (event.uuid) {
          deleteEvent({ uuid: event.uuid });
          message.success(`Appointment ${event.uuid} deleted`, 1);
        }
      },
      onCancel() {
        console.log('delete process cancelled'); // eslint-disable-line no-console
      },
    });
  };
  return (
    <div
      style={styles}
      title={event.title}
      key={event.uuid?.toString()}
      onClick={readOnly ? undefined : onClickHandler}
      className={`${classes.event} ${classes['bg_' + event.bgColor]} ${
        readOnly ? 'read-only' : ''
      }`}
    >
      <div className={classes.event_container}>
        <span className={classes.event_info}>{event.title}</span>
        <div className={classes.icon_container}>{icons}</div>
      </div>
      <span className={classes.event_info}>
        {dayjs(event.startTime).format('HH:mm')} -{' '}
        {dayjs(event.endTime).format('HH:mm')}
      </span>
    </div>
  );
};

export default TeamtableItem;
