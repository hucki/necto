import React, {useState, useEffect} from 'react';
import { Form, Input, Modal } from "antd";
import { DatePicker } from '../../../elements/index';
import { connect } from 'react-redux';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css';
import TimetableItem from '../TimetableItem/TimetableItem';
import AddButton from '../../../elements/AddButton/AddButton';
import InputForm from '../../Appointments/InputForm/InputForm';
import {addAppointment, ADD_APPOINTMENT} from '../../../actions/actions'
import dayjs from 'dayjs';

const renderCustomEvent = (event, defaultAttributes, styles) => {
  return (
    <TimetableItem
      key={event.id}
      event={event}
      defaultAttributes={defaultAttributes}
      styles={styles}/>
  )
}

const TimetableContainer = ({events, currentDate, hoursInterval, dispatch}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: 'New Appointment',
        startTime: dayjs().subtract(7, 'h'),
        endTime: dayjs().subtract(7, 'h').add(45,'m')
     });

    }
  }, [visible]);

  function onClose() {
    setVisible(false);
  }

  function onOkHandler() {
    dispatch(addAppointment({
      name: form.getFieldValue('name'),
      startTime: form.getFieldValue('startTime'),
      endTime: form.getFieldValue('endTime')
    }));
    setVisible(false);
  }


  function getPosition(e) {
    e.preventDefault();
    const clickOnFreeTime = !e.target.className.indexOf('styles_day__')

    if (clickOnFreeTime) {
      const rowId = (e.target.className.split(' ')[1]);
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const numberOfHours = hoursInterval[1]-hoursInterval[0]+1;
      const cellHeight = (rect.bottom-rect.top)/numberOfHours;
      const startOfDay = currentDate.clone().set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0);
      const clickTimeMin = ((y-cellHeight)/(cellHeight/60))
      const clickTime = startOfDay.clone().add(clickTimeMin,'m')
      const fullQuarterHour = Math.round(clickTime.get('minute')/15)*15;
      const clickTimeFQH = clickTime.set('minutes', 0).add(fullQuarterHour, 'm')
      console.log(`clicked on ${rowId}'s row at around: ${clickTimeFQH.format('HH:mm')}`);
    }
  }

  return (
    <div className={classes.TimetableContainer} onClick={getPosition}>
      <Timetable
        timeLabel={dayjs(currentDate).format('DD.MM.YYYY')}
        hoursInterval={hoursInterval}
        events={events}
        renderEvent={renderCustomEvent}
        styles={classes}
        />
      {/* <AddButton /> */}
      <Modal forceRender visible={visible} onOk={onOkHandler} onCancel={onClose}>
        <Form form={form}>
          <Form.Item label='Title' name='name'><Input /></Form.Item>
          <Form.Item label='Start' name='startTime'><DatePicker showTime/></Form.Item>
          <Form.Item label='End' name='endTime'><DatePicker showTime/></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

function filteredEvents(events, currentDate) {
  const filtered = {};
  Object.keys(events).map(stateKey => {
    filtered[stateKey] = [];
    events[stateKey].map(event => {
      if (dayjs(event.startTime).isSame(currentDate, 'day')) filtered[stateKey] = [...filtered[stateKey], event];
    })
  })
  return filtered;
}

const MapStateToProps = state => {
  return {
    events: filteredEvents(state.events, state.currentDate),
    currentDate: state.currentDate,
    hoursInterval: state.hoursInterval
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addAppointment: addAppointment,
    dispatch
  };
}


export default connect(MapStateToProps, mapDispatchToProps)(TimetableContainer)