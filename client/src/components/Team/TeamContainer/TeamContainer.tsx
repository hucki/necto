import React from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { TeamMember } from '../../../types/User';
dayjs.extend(isBetween);

interface TeamContainerProps {
  teamMembers: TeamMember[];
}

const TeamContainer = ({ teamMembers }: TeamContainerProps) => {
  const dataSource = teamMembers.map((member) => {
    return {
      key: member.id,

      'First Name': member.firstName,
      'Last Name': member.lastName,
      'Plan Color': member.bgColor,
      'Week Plan': member.appointmentsPerWeek,
    };
  });

  const columns = Object.keys(dataSource[0]).map((key) => {
    return {
      title: key,
      dataIndex: key,
      key: key,
    };
  });
  return (
    <>
      <Table dataSource={dataSource} columns={columns} size="small" />
    </>
  );
};

export default TeamContainer;
