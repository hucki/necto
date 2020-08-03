
import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

const TeamContainer = ({teamMembers}) => {
  const dataSource = teamMembers.map(member => ({key: member.id, ...member}));
  const columns = Object.keys(teamMembers[0]).map(key => ( {
    title: key,
    dataIndex: key,
    key: key
  } ) )
  return (
    <Table dataSource={dataSource} columns={columns} />
  );
};

const MapStateToProps = state => {
  return {
    teamMembers: state.appointments.teamMembers
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     addTeamMember,
//     dispatch
//   };
// };


export default connect(MapStateToProps, null)(TeamContainer);