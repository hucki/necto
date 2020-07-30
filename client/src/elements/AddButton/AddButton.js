import React, {useState, useCallback, useEffect} from 'react';
import { Form, Input, Modal, Button, Tooltip, DatePicker } from "antd";
import {PlusOutlined} from '@ant-design/icons';
import classes from './AddButton.module.css';
import { connect } from "react-redux";
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import {addAppointment} from '../../actions/actions'

dayjs.extend(weekday)

const AddButton = ({dispatch}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState(
      { name: 'new Appointment',
        startTime: dayjs(),
        endTime: dayjs()
      });

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: 'New Appointment',
        startTime: dayjs(),
        endTime: dayjs().add(45,'m')
     });

    }
  }, [visible]);

  function onClose() {
    setVisible(false);
  }

  function onOkHandler() {
    setNewAppointment(state => {return {
      name: form.getFieldValue('name'),
      startTime: form.getFieldValue('startTime'),
      endTime: form.getFieldValue('endTime')
    }})
    console.log('new', newAppointment)
    dispatch(addAppointment(newAppointment));
    setVisible(false);
  }

  return (
    <>
    <Tooltip title="new Appointment">
      <Button type="primary" shape="circle" icon={ <PlusOutlined />} onClick={() => setVisible(true)} className={classes.AddButton}/>
    </Tooltip>
    <Modal forceRender visible={visible} onOk={onOkHandler} onCancel={onClose}>
        <Form form={form}>
          <Form.Item label='Title' name='name'><Input /></Form.Item>
          <Form.Item label='Start' name='startTime'><DatePicker showTime/></Form.Item>
          <Form.Item label='End' name='endTime'><DatePicker showTime/></Form.Item>
        </Form>
      </Modal>
  </>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    addAppointment: (newAppointment) => dispatch({ type: "ADD_APPOINTMENT", payload: newAppointment})
  };
}

export default connect(mapDispatchToProps)(AddButton);