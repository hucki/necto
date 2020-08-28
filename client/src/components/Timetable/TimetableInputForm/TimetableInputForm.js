import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Modal,
  message,
  Radio,
  Switch,
  Select,
  Timeline,
  Button,
  Popover,
  Divider,
  Tooltip,
} from 'antd';
import { DatePicker, TimePicker } from '../../../elements/index';
import { connect } from 'react-redux';
import { RRule, rrulestr } from 'rrule';
import {
  addAppointment,
  toggleVisible,
  setRrule,
  setStart,
  setEnd,
} from '../../../actions/actions';
import dayjs from 'dayjs';
import { HomeTwoTone, HomeOutlined } from '@ant-design/icons';

const TimetableInputForm = ({
  visible,
  events,
  dispatch,
  rowId,
  startTime,
  endTime,
  newRrule,
}) => {
  const [form] = Form.useForm();
  const [switcheroo, setSwitcheroo] = useState({ disabled: true });
  const [timeline, setTimeline] = useState([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isHomeVisit, setIsHomeVisit] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: 'New Appointment',
        startTime: startTime,
        duration: 45,
        endTime: endTime,
        isRecurring: false,
        isHomeVisit: false,
        frequency: 'WEEKLY',
        count: 10,
        rruleString: '',
      });
    }
  }, [visible, endTime, form, startTime]);

  // Form Layout Options
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
    size: 'small',
  };

  const initialValues = {
    initialValues: {
      duration: 45,
      frequency: 'WEEKLY',
      count: 10,
    },
  };

  const dateTimeFormat = {
    date: 'DD.MM.YYYY',
    time: 'HH:mm',
  };

  const datePickerFormat = {
    showTime: true,
    format: `${dateTimeFormat.date} ${dateTimeFormat.time}`,
    minuteStep: 15,
  };

  function onDurationChange(e) {
    const value = e.target.value;
    const newTime = startTime.add(value, 'm');
    dispatch(setEnd(newTime));
    form.setFieldsValue({
      duration: value,
      endTime,
    });
    return;
  }

  function onStartTimeChange(e) {
    dispatch(setStart(e));
    const value = form.getFieldValue('duration');
    const newTime = e.add(value, 'm');
    dispatch(setEnd(newTime));
    form.setFieldsValue({
      duration: value,
      startTime,
      endTime,
    });
    return;
  }

  function checkOverlap() {
    if (!events[rowId].length) return false;
    const checkStart = form.getFieldValue('startTime');
    const checkEnd = form.getFieldValue('endTime');
    const result = events[rowId].filter(
      (event) =>
        (checkStart >= event.startTime && checkStart <= event.endTime) ||
        (checkEnd >= event.startTime && checkEnd <= event.endTime)
    );
    if (!result.length) return false;
    return true;
  }
  function onSwitchRecurring(checked) {
    setIsRecurring(checked);
    setSwitcheroo({ disabled: !checked });
  }

  function onSwitchHomeVisit(checked) {
    setIsHomeVisit(checked);
  }

  function onFrequencyChangeHandler() {}

  function onRecurrenceChangeHandler(e) {
    form.setFieldsValue({ count: e.target.value });
  }
  function buildRrule() {
    if (isNaN(form.getFieldValue('count')) || form.getFieldValue('count') < 1)
      return false;
    const rrule = new RRule({
      freq:
        form.getFieldValue('frequency') === 'WEEKLY'
          ? RRule.WEEKLY
          : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: form.getFieldValue('count'),
      dtstart: new Date(form.getFieldValue('startTime')),
    });
    dispatch(setRrule(rrule.toString()));
    return rrule.toString();
  }

  function onBuildTimelineHandler() {
    const rrule = new RRule({
      freq:
        form.getFieldValue('frequency') === 'WEEKLY'
          ? RRule.WEEKLY
          : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: form.getFieldValue('count'),
      dtstart: new Date(form.getFieldValue('startTime')),
    });
    dispatch(setRrule(rrule.toString()));
    setTimeline(
      <Timeline>
        {rrule.all().map((date) => (
          <Timeline.Item>
            {dayjs(date).format('ddd DD.MM.YYYY HH:mm')}
          </Timeline.Item>
        ))}
      </Timeline>
    );
  }

  function onOkHandler() {
    if (checkOverlap()) {
      message.error(
        'Overlapping Appointments are not allowed. Please check again'
      );
      return false;
    }
    if (isRecurring) {
      const currentRrule = buildRrule();
      if (!currentRrule) {
        message.error('Input for Recurrence Rule invalid. Please check again');
        return false;
      } else {
        const successMsg = [
          <div>added appointments {rrulestr(currentRrule).toText()}:</div>,
        ];
        if (currentRrule !== '') {
          rrulestr(currentRrule)
            .all()
            .map((date) => {
              dispatch(
                addAppointment({
                  rowId: rowId,
                  name: form.getFieldValue('name'),
                  startTime: dayjs(date),
                  endTime: dayjs(date).add(form.getFieldValue('duration'), 'm'),
                  rrule: currentRrule,
                  homeVisit: isHomeVisit,
                })
              );
              successMsg.push(
                `${dayjs(date).format('ddd DD.MM HH:mm')} - ${dayjs(date)
                  .add(form.getFieldValue('duration'), 'm')
                  .format('HH:mm')}`
              );
              return date;
            });
        }
        const outputMsg = successMsg.map((date) => (
          <>
            <p>{date}</p>
          </>
        ));
        message.success(outputMsg, 2);
      }
    } else {
      dispatch(
        addAppointment({
          rowId: rowId,
          name: form.getFieldValue('name'),
          startTime: form.getFieldValue('startTime'),
          endTime: form.getFieldValue('endTime'),
          rrule: '',
          homeVisit: isHomeVisit,
        })
      );
    }
    dispatch(toggleVisible());
    setDefaults();
  }

  function onClose(e) {
    setDefaults();
    e.stopPropagation();
    dispatch(toggleVisible());
  }

  function setDefaults() {
    setIsRecurring(false);
    setIsHomeVisit(false);
    setSwitcheroo({ disabled: true });
  }

  return (
    <Modal forceRender visible={visible} onOk={onOkHandler} onCancel={onClose}>
      <Form form={form} {...layout} {...initialValues}>
        <h3>{rowId}</h3>
        <Form.Item
          label="Title"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please add a Title to the Appointment',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Time">
          <Input.Group compact>
            <Form.Item>
              <DatePicker
                name="startTime"
                value={dayjs(startTime)}
                {...datePickerFormat}
                onChange={onStartTimeChange}
              />{' '}
              -&nbsp;
            </Form.Item>
            <Form.Item>
              {' '}
              <TimePicker
                name="endTime"
                disabled
                value={dayjs(endTime)}
                format={dateTimeFormat.time}
              />
            </Form.Item>
          </Input.Group>
          <Form.Item label="Duration">
            <Radio.Group
              onChange={onDurationChange}
              name="duration"
              inline
              defaultValue={45}
            >
              <Radio value={45}> 0:45</Radio>
              <Radio value={30}> 0:30</Radio>
            </Radio.Group>
          </Form.Item>
          <Tooltip title="Home Visit?">
            <Form.Item valuePropName="checked" label="Home Visit?">
              <Switch
                name="isHomeVisit"
                checkedChildren={<HomeTwoTone />}
                unCheckedChildren={<HomeOutlined />}
                checked={isHomeVisit}
                onChange={onSwitchHomeVisit}
              />
            </Form.Item>
          </Tooltip>
        </Form.Item>

        <Divider orientation="left">
          <Form.Item valuePropName="checked">
            <Switch
              name="isRecurring"
              onChange={onSwitchRecurring}
              checked={isRecurring}
            />{' '}
            recurring Appointment?
          </Form.Item>
        </Divider>
        <Form.Item label="Frequency">
          <Input.Group compact>
            <Form.Item>
              <Select
                {...switcheroo}
                name="frequency"
                style={{ width: 120 }}
                onChange={onFrequencyChangeHandler}
                defaultValue="WEEKLY"
              >
                <Select.Option value="WEEKLY">weekly</Select.Option>
                <Select.Option value="MONTHLY" disabled>
                  monthly
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Input
                name="count"
                {...switcheroo}
                style={{ width: '50%' }}
                prefix="x"
                onChange={onRecurrenceChangeHandler}
                defaultValue={10}
              />
            </Form.Item>
            <Popover content={timeline} trigger="click">
              <Button {...switcheroo} onClick={onBuildTimelineHandler}>
                show Result
              </Button>
            </Popover>
          </Input.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

function filteredEvents(events, currentDate) {
  const filtered = {};
  Object.keys(events).map((stateKey) => {
    filtered[stateKey] = [];
    events[stateKey].map((event) => {
      if (dayjs(event.startTime).isSame(currentDate, 'day'))
        filtered[stateKey] = [...filtered[stateKey], event];
      return event;
    });
    return stateKey;
  });
  return filtered;
}

const MapStateToProps = (state) => {
  return {
    events: filteredEvents(
      state.appointments.events,
      state.current.currentDate
    ),
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    startTime: state.newAppointment.startTime,
    endTime: state.newAppointment.endTime,
    newRrule: state.newAppointment.rrule,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAppointment,
    setStart,
    setEnd,
    setRrule,
    dispatch,
  };
};

export default connect(MapStateToProps, mapDispatchToProps)(TimetableInputForm);
