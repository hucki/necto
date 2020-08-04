import React from 'react';
import { connect } from 'react-redux';
import classes from './ProgressBar.module.css';
import { Progress } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const ProgressBar = ({user, userId, userData, events, currentDate}) => {

  let plannedAppointments = 0;
    events[user].map(event => {
      if(dayjs(event.startTime).isBetween(dayjs(currentDate).startOf('week'), dayjs(currentDate).endOf('week'))) {
        plannedAppointments++;
      }
    });
  console.log('ratio', plannedAppointments, userData.appointmentsPerWeek)
  const progress = parseInt(plannedAppointments/userData.appointmentsPerWeek*100)
  const planningMsg = () => {
    if (progress < 15) return 'Keep planning. You can do it! 😀'
    if (progress < 50) return 'Nearly half there 👍'
    if (progress < 90) return 'Almost there 🚀'
    return 'Only a few clicks away 🏁'

  }
  return (
    <div>
    <div className={classes.progressMsg}>{planningMsg()}</div>
    <div className={classes.progressBar}><Progress percent={progress} size="small" /></div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    events: state.appointments.events,
    user: state.userData.currentUser,
    userId: state.userData.currentUserId,
    userData: state.appointments.teamMembers.filter(member => member.id === state.userData.currentUserId)[0],
    currentDate: state.current.currentDate
  }
}
export default connect(mapStateToProps, null)(ProgressBar);