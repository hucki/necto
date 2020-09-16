import React, { useEffect, useState } from 'react';
import useDimensions from 'react-use-dimensions';
import { useWeeksEvents } from '../../../hooks/events';
import { events2Appointments } from '../../../helpers/dataConverter';
import { connect } from 'react-redux';
import classes from './UserCalendarContainer.module.css';
import {
  toggleVisible,
  clickRow,
  setStart,
  setEnd,
  setDimensions,
  setCellDimensions,
} from '../../../actions/actions';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import TimetableInputForm from '../TimetableInputForm/TimetableInputForm';
import TeamtableDay from '../TeamtableDay/TeamtableDay';
dayjs.extend(isBetween);

const UserCalendarContainer = ({
  currentDate,
  hoursInterval,
  daysToShow,
  dispatch,
  visible,
  width,
  height,
  top,
  timeScaleWidth,
  cellHeight,
  cellWidth,
  relCellHeight,
  user,
  rowId,
  teamMembers,
}) => {
  const [numOfHours] = useState(hoursInterval[1] - hoursInterval[0] + 1);
  const [numOfCols] = useState(daysToShow.length);
  const [ref, dimensions] = useDimensions();
  //eslint-disable-next-line no-unused-vars
  const [dimensionsCalculated, setDimensionsCalculated] = useState({
    width: -1,
    height: -1,
  });
  const { rawEventsIsLoading, rawEventsError, rawEvents } = useWeeksEvents(
    dayjs(currentDate).format('YYYY'),
    dayjs(currentDate).isoWeek()
  );
  //eslint-disable-next-line no-unused-vars
  const [startOfDay, setStartOfDay] = useState(
    currentDate
      .clone()
      .set('hour', hoursInterval[0])
      .set('minutes', 0)
      .set('seconds', 0)
  );

  useEffect(() => {
    const calcDimensions = () => {
      dispatch(
        setDimensions({
          width: Math.floor(dimensions.width),
          height: Math.floor(dimensions.height),
          top: Math.floor(dimensions.top),
        })
      );
      dispatch(
        setCellDimensions({
          cellHeight: height / numOfHours,
          cellWidth: (width - timeScaleWidth) / numOfCols,
          relCellHeight: 100 / numOfHours,
        })
      );
      setDimensionsCalculated({
        width: Math.floor(dimensions.width),
        height: Math.floor(dimensions.height),
      });
    };
    calcDimensions();
  }, [
    dispatch,
    height,
    numOfCols,
    numOfHours,
    timeScaleWidth,
    width,
    dimensions,
  ]);
  if (rawEventsIsLoading) return <div>Loading...</div>;
  if (rawEventsError)
    return <div>Error getting events: {rawEventsError.message}</div>;
  if (!rawEvents) return null;

  const events = userEvents(
    events2Appointments(
      rawEvents,
      teamMembers.filter((el) => el.firstName === user)
    ),
    currentDate,
    user
  );
  function getPosition(e) {
    e.preventDefault();
    if (typeof e.target.className !== 'string') return;
    const clickOnFreeTime = !e.target.className.indexOf('TeamtableDay_day__');

    if (clickOnFreeTime) {
      const clickedDay = currentDate
        .clone()
        .day(e.target.id)
        .add(1, 'd')
        .set('hour', hoursInterval[0])
        .set('minutes', 0)
        .set('seconds', 0);
      setStartOfDay(
        currentDate
          .clone()
          .day(e.target.id)
          .add(1, 'd')
          .set('hour', hoursInterval[0])
          .set('minutes', 0)
          .set('seconds', 0)
      );
      dispatch(clickRow(e.target.className.split(' ')[1]));
      const y = e.pageY - dimensions.y - cellHeight;
      const clickTimeMin = y / (cellHeight / 60);
      const clickTime = clickedDay
        .clone()
        .add(clickTimeMin, 'm')
        .set('seconds', 0);
      const fullQuarterHour = Math.round(clickTime.get('minute') / 15) * 15;
      const clickTimeFQH = clickTime
        .set('minutes', 0)
        .add(fullQuarterHour, 'm');

      dispatch(setStart(clickTimeFQH));
      dispatch(setEnd(clickTimeFQH.add(45, 'm')));
      dispatch(toggleVisible());
    }
  }

  const relCellHeightStyle = { height: `${relCellHeight}%` };

  const hoursScale = Array(hoursInterval[1] - hoursInterval[0])
    .fill(null)
    .map((hour, index) => (
      <div
        key={index + hoursInterval[0]}
        className={classes.hour}
        style={{
          ...relCellHeightStyle,
          width: `${timeScaleWidth}px`,
        }}
      >
        {' '}
        {index + hoursInterval[0]}:00
      </div>
    ));

  return (
    <>
      <div
        className={classes.UserCalendarContainer}
        onClick={getPosition}
        ref={ref}
        style={{
          backgroundSize: `1px ${2 * relCellHeight}%`,
        }}
      >
        <div className={classes.hoursScale}>
          <div
            className={classes.hoursScaleHeader}
            style={{
              height: `${100 / numOfHours}%`,
              width: `${timeScaleWidth}px`,
            }}
          ></div>
          {hoursScale}
        </div>
        <TeamtableDay events={events} headerArray={daysToShow} />
      </div>
      <TimetableInputForm
        visible={visible}
        rowId={user}
        unfilteredEvents={events}
      />
    </>
  );
};

function userEvents(events, currentDate, user) {
  const filtered = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  };
  if (events[user]) {
    events[user].map((event) => {
      if (
        dayjs(event.startTime).isBetween(
          dayjs(currentDate).startOf('week'),
          dayjs(currentDate).endOf('week')
        )
      )
        filtered[dayjs(event.startTime).format('ddd')] = [
          ...filtered[dayjs(event.startTime).format('ddd')],
          event,
        ];
      return event;
    });
  }
  return filtered;
}

const mapStateToProps = (state) => {
  return {
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId,
    user: state.userData.currentUser,
    width: state.teamtable.viewportDimensions.width,
    height: state.teamtable.viewportDimensions.height,
    top: state.teamtable.viewportDimensions.top,
    timeScaleWidth: state.teamtable.settings.timeScaleWidth,
    daysToShow: state.teamtable.settings.daysToShow,
    cellHeight: state.teamtable.calculatedDimensions.cellHeight,
    cellWidth: state.teamtable.calculatedDimensions.cellWidth,
    relCellHeight: state.teamtable.calculatedDimensions.relCellHeight,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleVisible,
    clickRow,
    setStart,
    setEnd,
    setDimensions,
    setCellDimensions,
    dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCalendarContainer);
