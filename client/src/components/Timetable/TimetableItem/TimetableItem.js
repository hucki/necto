import React from 'react';
import {connect} from 'react-redux';
import classes from '../Timetable.module.css';
import {Modal, message} from 'antd';
import dayjs from 'dayjs';
import { deleteAppointment } from '../../../actions/actions';

const TimetableItem = ({event, defaultAttributes, dispatch}) => {
  // TODO: put delete dialog in a separate Component
  const { confirm } = Modal;
  const onClickHandler = ({id, name, startTime, endTime}) => {
    confirm({
      content: (<div>
        <p>Delete Appointment id: {id}?</p>
        <p>{dayjs(startTime).format('HH:mm')} - {dayjs(endTime).format('HH:mm')}: <b>{name}</b></p>
      </div>),
      onOk () {
        console.log(id);
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
      <span className={classes.event_info}>{ event.name }</span>
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