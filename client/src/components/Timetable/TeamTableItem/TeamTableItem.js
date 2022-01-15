import React, { useEffect, useState } from 'react';
import classes from '../Teamtable.module.css';
import { Modal, message } from 'antd';
import dayjs from 'dayjs';
import { HomeTwoTone, ApiTwoTone } from '@ant-design/icons';
import { useDeleteEvent } from '../../../hooks/events';

const TeamtableItem = ({ event, styles, readOnly = false }) => {
  // TODO: put delete dialog in a separate Component
  const { confirm } = Modal;
  const [icons, setIcons] = useState([]);
  const [deleteEvent] = useDeleteEvent();

  useEffect(() => {
    setIcons([]);
    if (event.rrule !== '')
      setIcons((icons) => [...icons, <ApiTwoTone key="rruleIcon" />]);
    if (event.isHomeVisit)
      setIcons((icons) => [...icons, <HomeTwoTone key="homeVisitIcon" />]);
  }, [event]);
  const onClickHandler = ({ id, title, startTime, endTime }) => {
    confirm({
      content: (
        <div>
          <p>Delete Appointment id: {id}?</p>
          <p>
            {dayjs(startTime).format('HH:mm')} -{' '}
            {dayjs(endTime).format('HH:mm')}: <b>{title}</b>
          </p>
        </div>
      ),
      onOk() {
        deleteEvent({ id });
        message.success(`Appointment ${id} deleted`, 1);
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
      key={event.id}
      onClick={readOnly ? undefined : () => onClickHandler(event)}
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
