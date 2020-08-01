import React, {useState, useEffect} from 'react';
import { Form, Input, Modal, message, Radio } from 'antd';
import { DatePicker, TimePicker } from '../../../elements/index';
import { connect } from 'react-redux';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { addAppointment, toggleVisible, setEnd, setStart } from '../../../actions/actions';
import dayjs from 'dayjs';

const TimetableInputForm = ({visible, events, dispatch, rowId, startTime, endTime}) => {
  const [form] = Form.useForm();

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
      dispatch(toggleVisible())
    } else {
      message.error('Overlapping Appointments are not allowed');
    }
  }

  function onClose (e) {
    e.stopPropagation();
    dispatch(toggleVisible())
  }

  return (
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
  )
}

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
    hoursInterval: state.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId,
    startTime: state.newAppointment.startTime,
    endTime: state.newAppointment.endTime
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addAppointment: addAppointment,
    dispatch
  };
};

export default connect(MapStateToProps, mapDispatchToProps)(TimetableInputForm);