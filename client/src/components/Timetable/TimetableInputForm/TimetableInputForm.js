import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, message, Radio, Switch, Select, Timeline, Button, Popover, Divider } from 'antd';
import { DatePicker, TimePicker } from '../../../elements/index';
import { connect } from 'react-redux';
import { RRule, RRuleSet, rrulestr } from 'rrule'; // Upcoming rrule setup
import { addAppointment, toggleVisible, setRrule, setStart, setEnd } from '../../../actions/actions';
import dayjs from 'dayjs';
import { Option } from 'antd/lib/mentions';

const TimetableInputForm = ({visible, events, dispatch, rowId, startTime, endTime, newRrule}) => {

  const [form] = Form.useForm();
  const [switcheroo, setSwitcheroo] = useState({disabled: true});
  const [timeline, setTimeline] = useState([]);
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: 'New Appointment',
        startTime: startTime,
        duration: 45,
        endTime: endTime,
        isRecurring: false,
        frequency: 'WEEKLY',
        count: 10,
        rruleString: ''
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
    const newTime = startTime.add(value,'m');
    dispatch(setEnd(newTime));
    form.setFieldsValue({
      duration: value,
      endTime
    });
    return;
  }

  function onStartTimeChange (e) {
    dispatch(setStart(e));
    const value = form.getFieldValue('duration');
    const newTime = e.add(value,'m');
    dispatch(setEnd(newTime));
    form.setFieldsValue({
      duration: value,
      startTime,
      endTime
    });
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
    setIsRecurring(checked);
    setSwitcheroo({disabled: !checked});
  }

  function onFrequencyChangeHandler() {

  }

  function onRecurrenceChangeHandler (e){
    console.log(e.target.value)
    form.setFieldsValue({count: e.target.value})

  }
  function buildRrule() {
    if(isNaN(form.getFieldValue('count')) || form.getFieldValue('count') < 1) return false;
    const rrule = new RRule({
      freq: form.getFieldValue('frequency') === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: form.getFieldValue('count'),
      dtstart: new Date(form.getFieldValue('startTime'))
    })
    dispatch(setRrule(rrule.toString()));
    console.log('after setRR', newRrule)
    return rrule.toString();
  }

  function onBuildTimelineHandler() {
    const rrule = new RRule({
      freq: form.getFieldValue('frequency') === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: form.getFieldValue('count'),
      dtstart: new Date(form.getFieldValue('startTime'))
    })
    dispatch(setRrule(rrule.toString()));
    setTimeline(<Timeline>
      {rrule.all().map(date => <Timeline.Item>{dayjs(date).format('ddd DD.MM.YYYY HH:mm')}</Timeline.Item>)}
      </Timeline>)
  }

  function onOkHandler () {
    if (checkOverlap()) {
      message.error('Overlapping Appointments are not allowed. Please check again');
      return false;
    }
    if (isRecurring) {
      const currentRrule = buildRrule();
      if(!currentRrule) {
        message.error('Input for Recurrence Rule invalid. Please check again');
        return false;
      } else {
        const successMsg =[<div>added appointments {rrulestr(currentRrule).toText()}:</div>];
        if(currentRrule !== '') {
          rrulestr(currentRrule).all().map(date => {
            dispatch(addAppointment({
              rowId: rowId,
              name: form.getFieldValue('name'),
              startTime: dayjs(date),
              endTime: dayjs(date).add(form.getFieldValue('duration'), 'm'),
              rrule: currentRrule
            }))
            successMsg.push(`${dayjs(date).format('ddd DD.MM HH:mm')} - ${dayjs(date).add(form.getFieldValue('duration'), 'm').format('HH:mm')}`)
          })
        }
        message.success(successMsg.map(date => <><p>{date}</p></>))
      }
    } else {
      dispatch(addAppointment({
        rowId: rowId,
        name: form.getFieldValue('name'),
        startTime: form.getFieldValue('startTime'),
        endTime: form.getFieldValue('endTime'),
        rrule: form.getFieldValue('rruleString')
      }))
    }
    dispatch(toggleVisible());
    setIsRecurring(false);
    setSwitcheroo({disabled: true});
  }

  function onClose (e) {
    setIsRecurring(false);
    setSwitcheroo({disabled: true})
    console.log(switcheroo)
    e.stopPropagation();
    dispatch(toggleVisible())
  }

  return (
    <Modal forceRender visible={visible} onOk={onOkHandler} onCancel={onClose}>
        <Form form={form} {...layout}>
          <h3>{rowId}</h3>
          <Form.Item label='Title' name='name'
            rules={[{ required: true, message: 'Please add a Title to the Appointment' }]}><Input />
          </Form.Item>
          <Form.Item label='Time'>
            <Input.Group compact >
              <Form.Item name='startTime' ><DatePicker value={dayjs(startTime)} {...datePickerFormat} onChange={onStartTimeChange}/> -&nbsp;</Form.Item>
              <Form.Item name='endTime'> <TimePicker disabled value={dayjs(endTime)} format={dateTimeFormat.time}/></Form.Item>
            </Input.Group>
            <Form.Item label='Duration' name='duration'>
              <Radio.Group onChange={onDurationChange} name='duration' defaultValue={45} inline>
                <Radio value={45}> 0:45</Radio>
                <Radio value={30}> 0:30</Radio>
              </Radio.Group>
            </Form.Item>
          </Form.Item>
          <Divider orientation="left">
            <Form.Item name='isRecurring' valuePropName='checked' >
              <Switch onChange={onSwitchRecurring} checked={isRecurring}/> recurring Appointment?
            </Form.Item>
          </Divider>
          <Form.Item label='Frequency'>
            <Input.Group compact >
              <Form.Item >
                <Select {...switcheroo} name='frequency' defaultValue='WEEKLY' style={{ width: 120 }} onChange={onFrequencyChangeHandler}>
                  <Option value='WEEKLY'>weekly</Option>
                  <Option value='MONTHLY' disabled>monthly</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                  <Input  name='count' {...switcheroo}
                          style={{ width: '50%' }}
                          prefix='x'
                          defaultValue={10}
                          onChange={onRecurrenceChangeHandler}/>
              </Form.Item>
              <Popover content={timeline} trigger='click'>
                <Button {...switcheroo} onClick={onBuildTimelineHandler}>show Result</Button>
              </Popover>
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
    addAppointment,
    setStart,
    setEnd,
    setRrule,
    dispatch
  };
};

export default connect(MapStateToProps, mapDispatchToProps)(TimetableInputForm);