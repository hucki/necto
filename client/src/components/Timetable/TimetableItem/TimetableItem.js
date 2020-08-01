import React from 'react';
import {connect} from 'react-redux';
import classes from '../Timetable.module.css';
import {Modal, message} from 'antd';
import dayjs from 'dayjs';
import { deleteAppointment } from '../../../actions/actions';

const TimetableItem = ({event, defaultAttributes, dispatch}) => {

  const { confirm } = Modal;
  const onClickHandler = ({id, name, startTime, endTime}) => {
    confirm({
      content: (<div>
        <p>Do you want to delete the following Appointment?</p>
        <p>ID {id}: {name}</p>
        <p>{dayjs(startTime).format('HH:MM')} - {dayjs(endTime).format('HH:MM')}</p>
      </div>),
      onOk () {
        console.log(id);
        dispatch(deleteAppointment(id));
        message.success('Appointment deleted');
      },
      onCancel () {
        console.log('cancael');
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