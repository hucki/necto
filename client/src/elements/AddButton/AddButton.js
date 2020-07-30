import React, {useState, useCallback, useEffect} from 'react';
import { Form, Input, Modal, Button, Tooltip, DatePicker } from "antd";
import {PlusOutlined} from '@ant-design/icons';
import classes from './AddButton.module.css';
import { connect } from "react-redux";
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import addAppointment from '../../actions/actions'

dayjs.extend(weekday)

const AddButton = (addAppointment) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState([
      { name: 'Custom Event 1',
        startTime: dayjs('2018-02-23T11:30:00'),
        endTime: dayjs('2018-02-23T13:30:00')
      }]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ user: "antd" });
    }
  }, [visible]);

  function onClose() {
    setVisible(false);
  }

  function onOkHandler() {
    setNewAppointment(state => [{
      name: form.getFieldValue('name'),
      startTime: form.getFieldValue('startTime'),
      endTime: form.getFieldValue('endTime')
    }])


    //addAppointment();
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
          <Form.Item label='Start' name='startTime'><DatePicker /></Form.Item>
          <Form.Item label='End' name='endTime'><DatePicker /></Form.Item>
        </Form>
      </Modal>
  </>
  )
}

function mapDispatchToProps(dispatch, newAppointment) {
  return {
    addAppointment: () => dispatch({ type: "ADD_APPOINTMENT", })
  };
}

export default connect(mapDispatchToProps)(AddButton);