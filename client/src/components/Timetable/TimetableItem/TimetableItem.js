import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import classes from '../Timetable.module.css';
import {Modal, message} from 'antd';
import dayjs from 'dayjs';
import { deleteAppointment } from '../../../actions/actions';
import { SyncOutlined } from '@ant-design/icons';

const TimetableItem = ({event, defaultAttributes, dispatch}) => {
  // TODO: put delete dialog in a separate Component
  const { confirm } = Modal;
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    if (event.rrule !== '') {
      setIcons(icons => [...icons, <SyncOutlined />]);
    }
  }, [])

  const onClickHandler = ({id, name, startTime, endTime}) => {
    confirm({
      content: (<div>
        <p>Delete Appointment id: {id}?</p>
        <p>{dayjs(startTime).format('HH:mm')} - {dayjs(endTime).format('HH:mm')}: <b>{name}</b></p>
      </div>),
      onOk () {
        dispatch(deleteAppointment(id));
        message.success(`Appointment ${id} deleted`);
      },
      onCancel () {
        console.log('delete process cancelled'); // eslint-disable-line no-console
      }
    });
  };

  return (
    <div {...defaultAttributes}
      title={event.name}
      key={event.id}
      onClick={() => onClickHandler(event)}
      className={`${classes.event} ${classes[event.bgcolor]}`}
    >
      <div className={classes.event_container}>

        <span className={classes.event_info}>{ event.name }</span>
        <div className={classes.icon_container}>{icons}</div>
      </div>
      <span className={classes.event_info}>
        { event.startTime.format('HH:mm') } - { event.endTime.format('HH:mm') }
      </span>

    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    deleteAppointment: deleteAppointment,
    dispatch
  };
};

export default connect(null, mapDispatchToProps)(TimetableItem);