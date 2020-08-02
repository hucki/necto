import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, message, Radio, Switch, Select } from 'antd';
import { DatePicker, TimePicker } from '../../../elements/index';
import { connect } from 'react-redux';
import { RRule, RRuleSet, rrulestr } from 'rrule'; // Upcoming rrule setup
import { addAppointment, toggleVisible } from '../../../actions/actions';
import dayjs from 'dayjs';
import { Option } from 'antd/lib/mentions';

const TimetableInputForm = ({visible, events, dispatch, rowId, startTime, endTime}) => {
  const [form] = Form.useForm();
  const [switcheroo, setSwitcheroo] = useState({disabled: true});
  const [rruleDates, setRruleDates] = useState([]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: 'New Appointment',
        startTime: startTime,
        duration: 45,
        endTime: endTime,
        isRecurring: false,
        frequency: 'WEEKLY',
        count: 10
      });

    }
  }, [visible]);

  // Form Layout Options
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
    size: 'small'
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
  function onSwitchRecurring(checked) {
    setSwitcheroo({disabled: !checked});
  }

  function onFrequencyChangeHandler() {

  }

  function onRecurrenceChangeHandler (e){
    console.log(e.target.value)
    form.setFieldsValue({count: e.target.value})

  }
  function buildRrule() {
    const rrule = new RRule({
      freq: form.getFieldValue('frequency') === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: form.getFieldValue('count'),
      dtstart: new Date(form.getFieldValue('startTime'))
    })
    setRruleDates([...rrule.all().map(date => date)]);
    console.log(rruleDates)
  }

  function onOkHandler () {
    if (form.getFieldValue('isRecurring') && !buildRrule()) message.error('Input for Recurrence Rule invalid. Please check again');
    if (checkOverlap()) message.error('Overlapping Appointments are not allowed. Please check again');
    else {
      dispatch(addAppointment({
        rowId: rowId,
        name: form.getFieldValue('name'),
        startTime: form.getFieldValue('startTime'),
        endTime: form.getFieldValue('endTime')
      }));
      dispatch(toggleVisible())
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
              <Radio value={45}> 0:45</Radio>
              <Radio value={30}> 0:30</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='End' name='endTime'><TimePicker disabled format='HH:mm'/></Form.Item>

          <Form.Item name='isRecurring'  label='Recurring' valuePropName='checked' >
            <Switch onChange={onSwitchRecurring} />
          </Form.Item>
          <Form.Item label='Frequency'>
            <Input.Group compact >
              <Form.Item >
                <Select {...switcheroo} name='frequency' defaultValue='WEEKLY' style={{ width: 120 }} onChange={onFrequencyChangeHandler}>
                  <Option value='WEEKLY'>weekly</Option>
                  <Option value='MONTHLY' disabled>monthly</Option>
                </Select>
              </Form.Item>
              <Form.Item  >
                  <Input name='count' {...switcheroo} style={{ width: '50%' }} prefix='x' defaultValue={10} onChange={onRecurrenceChangeHandler}/>
              </Form.Item>
            </Input.Group>
          </Form.Item>
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
    events: filteredEvents(state.appointments.events, state.current.currentDate),
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId,
    startTime: state.newAppointment.startTime,
    endTime: state.newAppointment.endTime,
    newRrule: state.newAppointment.rrule
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addAppointment: addAppointment,
    dispatch
  };
};

export default connect(MapStateToProps, mapDispatchToProps)(TimetableInputForm);