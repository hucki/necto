import React from 'react';
import { connect } from 'react-redux';
import classes from './TeamtableDay.module.css';
import TeamTableItem from '../TeamTableItem/TeamTableItem';
import dayjs from 'dayjs';
import { Event } from '../../../types/Event';
import { AppState } from '../../../types/AppState';

type ItemStyle = {
  top: string;
  height: string;
};

interface TeamtableDayProps {
  events: {
    [key: string]: Event[];
  };
  headerArray: string[];
  cellWidth: number;
  cellHeight: number;
  hoursInterval: [number, number];
}
const TeamtableDay = ({
  events,
  headerArray,
  cellWidth,
  cellHeight,
  hoursInterval,
}: TeamtableDayProps) => {
  const renderCustomEvent = (event: Event, styles: ItemStyle) => {
    return (
      <TeamTableItem
        readOnly={false}
        key={event.uuid?.toString()}
        event={event}
        styles={styles}
      />
    );
  };
  function getItemStyle(event: Event) {
    const minsFromStartOfDay = dayjs(event.startTime).diff(
      dayjs(event.startTime).startOf('day').add(hoursInterval[0], 'h'),
      'minute'
    );
    const minsDuration = dayjs(event.endTime).diff(event.startTime, 'minute');
    const pxPerMinute = cellHeight / 60;
    const pxFromStartOfDay = pxPerMinute * minsFromStartOfDay + cellHeight;
    const pxItemHeight = pxPerMinute * minsDuration;
    const itemStyle = {
      top: `${pxFromStartOfDay}px`,
      height: `${pxItemHeight}px`,
    };
    return itemStyle;
  }

  const numOfHours = hoursInterval[1] - hoursInterval[0] + 1;
  const relCellHeightStyle = { height: `${100 / numOfHours}%` };

  const days = headerArray.map((rowTitle, index) => (
    <div
      key={rowTitle}
      id={`${index}`}
      className={`${classes.day} ${rowTitle}`}
      style={{
        height: '100%',
        width: `${cellWidth}px`,
      }}
    >
      <div
        className={classes.dayHeader}
        style={{
          ...relCellHeightStyle,
          width: `${cellWidth}px`,
        }}
      >
        <div className={classes.dayHeaderText}>{rowTitle} </div>
      </div>

      {events[rowTitle]
        ? events[rowTitle].map((event: Event) =>
            renderCustomEvent(event, getItemStyle(event))
          )
        : null}
    </div>
  ));

  return <>{days}</>;
};

const mapStateToProps = (state: AppState) => {
  return {
    hoursInterval: state.settings.hoursInterval,
    cellWidth: state.teamtable.calculatedDimensions.cellWidth,
    cellHeight: state.teamtable.calculatedDimensions.cellHeight,
  };
};

export default connect(mapStateToProps, null)(TeamtableDay);
