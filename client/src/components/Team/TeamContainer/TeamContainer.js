import React from 'react';
import { connect } from 'react-redux';
import { Table, Progress } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const TeamContainer = ({ teamMembers, events, currentDate }) => {
  const dataSource = teamMembers.map((member) => {
    let plannedAppointments = 0;
    events[member.firstName].map((event) => {
      if (
        dayjs(event.startTime).isBetween(
          dayjs(currentDate).startOf('week'),
          dayjs(currentDate).endOf('week')
        )
      ) {
        plannedAppointments++;
      }
      return event;
    });
    return {
      key: member.id,
      id: member.id,
      'First Name': member.firstName,
      'Last Name': member.lastName,
      'Plan Color': member.color,
      'Week Plan': member.appointmentsPerWeek,
      'Planning Progress': parseInt(
        (plannedAppointments / member.appointmentsPerWeek) * 100
      ),
    };
  });

  const columns = Object.keys(dataSource[0]).map((key) => {
    if (key === 'Planning Progress') {
      return {
        title: key,
        dataIndex: key,
        key: key,
        render: (progress) => (
          <>
            <Progress percent={progress} size="small" />
          </>
        ),
      };
    } else {
      return {
        title: key,
        dataIndex: key,
        key: key,
      };
    }
  });
  return (
    <>
      <Table dataSource={dataSource} columns={columns} size="small" />
    </>
  );
};

const MapStateToProps = (state) => {
  return {
    events: state.appointments.events,
    teamMembers: state.appointments.teamMembers,
    currentDate: state.current.currentDate,
  };
};

export default connect(MapStateToProps, null)(TeamContainer);
