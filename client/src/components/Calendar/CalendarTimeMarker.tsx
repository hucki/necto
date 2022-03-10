/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useCurrentTime } from '../../hooks/time';

interface CalendarTimeMarkerProps {
  offsetLeft?: string;
  scaleHeightUnits?: number;
  firstHour?: number;
}

function CalendarTimeMarker({
  offsetLeft = '3rem',
  scaleHeightUnits = 14,
  firstHour = 7,
}: CalendarTimeMarkerProps) {
  const { date, time, hours, minutes } = useCurrentTime();
  return (
    <div
      className="now"
      css={{
        position: 'absolute',
        top: `calc(((100% / ${scaleHeightUnits}) * ${
          hours - firstHour + 1
        }) + (100% / ${scaleHeightUnits}) * ${minutes / 60})`,
        left: offsetLeft,
        width: `calc(100% - ${offsetLeft})`,
        borderTop: '1px solid red',
        fontSize: '0.8rem',
        color: 'red',
        paddingRight: '0.3rem',
      }}
    >
      {time}
    </div>
  );
}

export default CalendarTimeMarker;
