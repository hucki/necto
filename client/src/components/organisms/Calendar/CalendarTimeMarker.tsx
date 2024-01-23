import React from 'react';
import styled from '@emotion/styled/macro';
import { useCurrentTime } from '../../../hooks/time';
import { Dayjs } from 'dayjs';

type TimeMarkerColor = 'red' | 'black';

interface CalendarTimeMarkerProps {
  offsetLeft?: string;
  scaleHeightUnits?: number;
  firstHour?: number;
  color?: TimeMarkerColor;
  dateTime?: Dayjs;
  onlyLine?: boolean;
  hasDot?: boolean;
}

interface TimeMarkerLineProps {
  offsetLeft?: string;
  scaleHeightUnits?: number;
  firstHour?: number;
  hours?: number;
  minutes?: number;
  color?: TimeMarkerColor;
  hasDot?: boolean;
}

const TimeMarkerLine = styled.div(
  ({
    scaleHeightUnits,
    firstHour = 6,
    hours = 9,
    minutes = 0,
    color = 'red',
    hasDot = true,
  }: TimeMarkerLineProps) => {
    return {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      top: `calc(((100% / ${scaleHeightUnits}) * ${
        hours - firstHour + 1
      }) + (100% / ${scaleHeightUnits}) * ${minutes / 60})`,
      width: '100%',
      borderTop: `1px solid ${color === 'red' ? '#f00a' : '#333a'}`,
      paddingRight: '0.3rem',
      zIndex: '1',
      pointerEvents: 'none',
      '::before': hasDot
        ? {
            width: '0.3rem',
            height: '0.3rem',
            content: '""',
            backgroundColor: color === 'red' ? '#f00a' : '#333a',
            position: 'absolute',
            top: '-0.15rem',
            left: '-0.3rem',
            borderRadius: '50%',
          }
        : undefined,
    };
  }
);

const TimeMarkerTime = styled.div(
  ({ color = 'red' }: { color?: TimeMarkerColor }) => ({
    fontSize: '0.7rem',
    color: color === 'red' ? '#f00a' : '#333a',
    alignSelf: 'flex-end',
  })
);

function CalendarTimeMarker({
  scaleHeightUnits = 14,
  firstHour = 7,
  color = 'red',
  dateTime,
  onlyLine = false,
  hasDot = true,
}: CalendarTimeMarkerProps) {
  const {
    time: currentTime,
    hours: currentHours,
    minutes: currentMinutes,
  } = useCurrentTime();
  const time = dateTime ? dateTime.format('HH:mm') : currentTime;
  const hours = dateTime ? dateTime.hour() : currentHours;
  const minutes = dateTime ? dateTime.minute() : currentMinutes;
  if (hours > firstHour + scaleHeightUnits - 1) return null;
  return (
    <TimeMarkerLine
      className="now"
      scaleHeightUnits={scaleHeightUnits}
      hours={hours}
      minutes={minutes}
      color={color}
      hasDot={hasDot}
    >
      {!onlyLine && (
        <TimeMarkerTime className="now-time" color={color}>
          {time}
        </TimeMarkerTime>
      )}
    </TimeMarkerLine>
  );
}

export default CalendarTimeMarker;
