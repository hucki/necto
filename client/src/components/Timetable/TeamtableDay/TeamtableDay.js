import React from 'react';
import { connect } from 'react-redux';
import classes from './TeamtableDay.module.css';
import TeamTableItem from '../TeamTableItem/TeamTableItem';
import dayjs from 'dayjs';

const TeamtableDay = ({events, headerArray, cellWidth, cellHeight, hoursInterval}) => {

  const renderCustomEvent = (event, styles) => {
    return (
      <TeamTableItem
        key={event.id}
        event={event}
        styles={styles}/>
    );
  };
  function getItemStyle(event) {
    const minsFromStartOfDay =  dayjs(event.startTime).diff(dayjs(event.startTime).startOf('day').add(hoursInterval[0],'h'), 'minute');
    const minsDuration = dayjs(event.endTime).diff(event.startTime, 'minute');
    const pxPerMinute = cellHeight / 60;
    const pxFromStartOfDay = (pxPerMinute * minsFromStartOfDay) + cellHeight;
    const pxItemHeight = pxPerMinute * minsDuration;
    const itemStyle = {
      top: `${pxFromStartOfDay}px`,
      height: `${pxItemHeight}px`
    };
    console.log(minsFromStartOfDay, minsDuration, pxPerMinute,pxFromStartOfDay)
    return itemStyle;
  }

  const numOfHours = hoursInterval[1]-hoursInterval[0]+1;
  const relCellHeightStyle = {height: `${100/numOfHours}%`};

  const days = headerArray.map(rowTitle =>
    <div  key={rowTitle}
          className={`${classes.day} ${rowTitle}`}
          style={{
            height: `100%`,
            width: `${cellWidth}px`,
          }}>
        <div className={classes.dayHeader} style={{
      ...relCellHeightStyle,
      width: `${cellWidth}px`}}>{rowTitle}</div>
        {events[rowTitle].map(event => renderCustomEvent(event, getItemStyle(event)))}
    </div>);

  return (
    <>
      {days}
    </>
  )
}

const mapStateToProps = state => {
  return {
    hoursInterval: state.settings.hoursInterval,
    cellWidth: state.teamtable.calculatedDimensions.cellWidth,
    cellHeight: state.teamtable.calculatedDimensions.cellHeight,
    headerArray: state.teamtable.settings.daysToShow
  };
};

export default connect(mapStateToProps, null)(TeamtableDay);