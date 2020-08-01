import React, {useState, useEffect} from 'react';
import { Form, Input, Modal, Select, message, Radio } from 'antd';
import { DatePicker, TimePicker } from '../../../elements/index';
import { connect } from 'react-redux';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css';
import TimetableItem from '../TimetableItem/TimetableItem';
import {addAppointment, deleteAppointment} from '../../../actions/actions';
import dayjs from 'dayjs';

const renderCustomEvent = (event, defaultAttributes, styles) => {
  return (
    <TimetableItem
      key={event.id}
      event={event}
      defaultAttributes={defaultAttributes}
      styles={styles}/>
  );
};

const TimetableContainer = ({events, currentDate, hoursInterval, dispatch}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [startTime, setStartTime] = useState(dayjs().set('seconds',0));
  const [endTime, setEndTime] = useState(dayjs().add(45,'m').set('seconds',0));
  const [rowId, setRowId] = useState('');

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: 'New Appointment',
        startTime: startTime,
        duration: 45,
        endTime: endTime
      });

    }
  }, [visible]);

  function onClose (e) {
    e.stopPropagation();
    setVisible(false);
  }

  function checkOverlap () {
    if (!events[rowId].length) return false;
    const checkStart = form.getFieldValue('startTime');
    const checkEnd = form.getFieldValue('endTime');
    const result = events[rowId].filter(event => (checkStart >= event.startTime && checkStart <= event.endTime) ||  (checkEnd >= event.startTime && checkEnd <= event.endTime));
    if (!result.length) return false;
    return true;
  }
  function onOkHandler () {
    if (!checkOverlap()) {
      dispatch(addAppointment({
        rowId: rowId,
        name: form.getFieldValue('name'),
        startTime: form.getFieldValue('startTime'),
        endTime: form.getFieldValue('endTime')
      }));
      setVisible(false);
    } else {
      message.error('Overlapping Appointments are not allowed');
    }
  }

  function getPosition (e) {
    e.preventDefault();
    const clickOnFreeTime = !e.target.className.indexOf('styles_day__');

    if (clickOnFreeTime) {
      setRowId(e.target.className.split(' ')[1]);
      const rect = e.target.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const numberOfHours = hoursInterval[1]-hoursInterval[0]+1;
      const cellHeight = (rect.bottom-rect.top)/numberOfHours;
      const startOfDay = currentDate.clone().set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0);
      const clickTimeMin = ((y-cellHeight)/(cellHeight/60));
      const clickTime = startOfDay.clone().add(clickTimeMin,'m');
      const fullQuarterHour = Math.round(clickTime.get('minute')/15)*15;
      const clickTimeFQH = clickTime.set('minutes', 0).add(fullQuarterHour, 'm').set('seconds',0);
      setStartTime(clickTimeFQH);
      setEndTime(clickTimeFQH.add(45,'m'));
      setVisible(true);
    }
  }
  // Form Layout Options
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },

  };
  const radioStyle = {
    // display: 'block',
    // height: '30px',
    // lineHeight: '30px',
  };

  const dateTimeFormat = {
    date: 'DD.MM.YYYY',
    time: 'HH:mm'
  }

  const datePickerFormat = {
    showTime: true,
    format: `${dateTimeFormat.date} ${dateTimeFormat.time}`,
    minuteStep: 15
  }

  function onDurationChange (e) {
    const value = e.target.value;
    form.setFieldsValue({duration: value});
    const newTime = form.getFieldValue('startTime').add(value,'m');
    form.setFieldsValue({endTime: newTime});
    return;
  }

  function onStartTimeChange (e) {
    const value = form.getFieldValue('duration');
    form.setFieldsValue({duration: value});
    const newTime = e.add(value,'m');
    form.setFieldsValue({endTime: newTime});
    return;
  }

  return (
    <div className={classes.TimetableContainer} onClick={getPosition}>
      <Timetable
        timeLabel={dayjs(currentDate).format('ddd DD.MM.')}
        hoursInterval={hoursInterval}
        events={events}
        renderEvent={renderCustomEvent}
        styles={classes}
      />
      <Modal forceRender visible={visible} onOk={onOkHandler} onCancel={onClose}>
        <Form form={form} {...layout}>
          <h1>{rowId}</h1>
          <Form.Item label='Title' name='name'
            rules={[{ required: true, message: 'Please add a Title to the Appointment' }]}><Input /></Form.Item>
          <Form.Item label='Start' name='startTime' >
            <DatePicker {...datePickerFormat} onChange={onStartTimeChange}/>
          </Form.Item>

          <Form.Item label='Duration' name='duration'>
            <Radio.Group onChange={onDurationChange} name='duration' defaultValue={45} inline>
              <Radio style={radioStyle} value={45}> 0:45</Radio>
              <Radio style={radioStyle} value={30}> 0:30</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='End' name='endTime'><TimePicker disabled format='HH:mm'/></Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

function filteredEvents (events, currentDate) {
  const filtered = {};
  Object.keys(events).map(stateKey => {
    filtered[stateKey] = [];
    events[stateKey].map(event => {
      if (dayjs(event.startTime).isSame(currentDate, 'day')) filtered[stateKey] = [...filtered[stateKey], event];
      return event;
    });
    return stateKey;
  });
  return filtered;
}

const MapStateToProps = state => {
  return {
    events: filteredEvents(state.events, state.currentDate),
    currentDate: state.currentDate,
    hoursInterval: state.hoursInterval
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addAppointment: addAppointment,
    deleteAppointment: deleteAppointment,
    dispatch
  };
};


export default connect(MapStateToProps, mapDispatchToProps)(TimetableContainer);