import React from 'react';
import styled from '@emotion/styled/macro';
import { useCurrentTime } from '../../hooks/time';

interface CalendarTimeMarkerProps {
  offsetLeft?: string;
  scaleHeightUnits?: number;
  firstHour?: number;
}

interface TimeMarkerLineProps {
  offsetLeft?: string;
  scaleHeightUnits?: number;
  firstHour?: number;
  hours?: number;
  minutes?: number;
}

const TimeMarkerLine = styled.div(({scaleHeightUnits, firstHour = 6, hours = 9, minutes= 0 }: TimeMarkerLineProps) => {
  return {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: `calc(((100% / ${scaleHeightUnits}) * ${
      hours - firstHour + 1
    }) + (100% / ${scaleHeightUnits}) * ${minutes / 60})`,
    width: '100%',
    borderTop: '1px solid #f00a',
    paddingRight: '0.3rem',
    zIndex: '1',
    pointerEvents: 'none',
    '::before': {
      width: '0.3rem',
      height: '0.3rem',
      content: '""',
      backgroundColor: '#f00a',
      position: 'absolute',
      top: '-0.15rem',
      left: '-0.3rem',
      borderRadius: '50%',
    }
  };
});

const TimeMarkerTime = styled.div({
  fontSize: '0.7rem',
  color: '#f00a',
  alignSelf: 'flex-end'
});

function CalendarTimeMarker({
  scaleHeightUnits = 14,
  firstHour = 7,
}: CalendarTimeMarkerProps) {
  const { time, hours, minutes } = useCurrentTime();
  if (hours > (firstHour + scaleHeightUnits - 1)) return null;
  return (
    <TimeMarkerLine
      className="now"
      scaleHeightUnits={scaleHeightUnits}
      hours={hours}
      minutes={minutes}
    >
      <TimeMarkerTime className="now-time">
        {time}
      </TimeMarkerTime>
    </TimeMarkerLine>
  );
}

export default CalendarTimeMarker;
