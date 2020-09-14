import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import classes from '../Teamtable.module.css';
import { Modal, message } from 'antd';
import dayjs from 'dayjs';
import { deleteAppointment } from '../../../actions/actions';
import { HomeTwoTone, ApiTwoTone } from '@ant-design/icons';

const TeamtableItem = ({ event, styles, dispatch }) => {
  // TODO: put delete dialog in a separate Component
  const { confirm } = Modal;
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    if (event.rrule !== '')
      setIcons((icons) => [...icons, <ApiTwoTone key="rruleIcon" />]);
    if (event.homeVisit)
      setIcons((icons) => [...icons, <HomeTwoTone key="homeVisitIcon" />]);
  }, [event]);

  const onClickHandler = ({ id, name, startTime, endTime }) => {
    confirm({
      content: (
        <div>
          <p>Delete Appointment id: {id}?</p>
          <p>
            {dayjs(startTime).format('HH:mm')} -{' '}
            {dayjs(endTime).format('HH:mm')}: <b>{name}</b>
          </p>
        </div>
      ),
      onOk() {
        dispatch(deleteAppointment(id));
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
      title={event.name}
      key={event.id}
      onClick={() => onClickHandler(event)}
      className={`${classes.event} ${classes[event.bgcolor]}`}
    >
      <div className={classes.event_container}>
        <span className={classes.event_info}>{event.name}</span>
        <div className={classes.icon_container}>{icons}</div>
      </div>
      <span className={classes.event_info}>
        {dayjs(event.startTime).format('HH:mm')} -{' '}
        {dayjs(event.endTime).format('HH:mm')}
      </span>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAppointment: deleteAppointment,
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(TeamtableItem);
