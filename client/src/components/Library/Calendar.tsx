import styled from '@emotion/styled/macro';
import * as colors from '../../styles/colors';

const calendarBorder = `1px solid ${colors.gray50}`;

type CalendarCommonProps = {
  numOfHours: number;
};

type CalendarScaleProps = {
  scaleWidth: string;
};

type CalendarColumnProps = CalendarCommonProps & {
  isToday: boolean;
};

type CalendarRessourceProps = {
  numOfRessources: number;
  index: number;
  isWeekend?: boolean;
  isPublicHoliday?: boolean;
};

type CalendarRessourceHeaderProps = {
  bgColor?: string;
};

const CalendarWrapper = styled.div({
  position: 'relative',
  fontSize: '1rem',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  textAlign: 'right',
});
// FIXME: alignment of scale with background pattern. Is connected to unset header heights (was calculated before)
const CalendarScale = styled.div(({ scaleWidth }: CalendarScaleProps) => ({
  width: scaleWidth,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRight: calendarBorder,
}));

const CalendarScaleHeader = styled.div(
  ({ numOfHours }: CalendarCommonProps) => ({
    height: `calc(100% / ${numOfHours})`,
    backgroundColor: `${colors.base}`,
  })
);

const CalendarScaleItem = styled.div(({ numOfHours }: CalendarCommonProps) => ({
  height: `calc(100% / ${numOfHours})`,
  fontStyle: 'italic',
  fontSize: 'small',
  backgroundColor: `${colors.base}`,
  borderTop: '2px solid',
  borderImageSlice: '1',
  borderImageSource: `linear-gradient(to right, ${colors.base}, ${colors.gray50})`,
}));

const CalendarScaleTime = styled.div({
  position: 'relative',
  top: '-10px',
  textAlign: 'left',
  fontSize: '0.7rem',
});

const CalendarColumnWrapper = styled.div({
  width: '100%',
  textAlign: 'center',
  position: 'relative',
});

const CalendarColumnDayHeader = styled.div(
  ({ numOfHours, isToday }: CalendarColumnProps) => ({
    height: `calc((100% / ${numOfHours}) / 2)`,
    backgroundColor: `${colors.base}`,
    color: `${colors.gray}`,
    fontWeight: isToday ? 'bold' : undefined,
    boxSizing: 'border-box',
    borderTop: isToday ? '0.2rem solid red' : '0.2rem solid transparent',
  })
);

const CalendarColumnRessourceWrapper = styled.div(
  ({ numOfHours }: CalendarCommonProps) => ({
    height: `calc((100% / ${numOfHours}) / 2)`,
    display: 'flex',
    flexDirection: 'row',
    borderBottom: calendarBorder,
  })
);

const CalendarColumnRessourceHeader = styled.div(
  ({
    numOfRessources,
    bgColor,
  }: CalendarRessourceProps & CalendarRessourceHeaderProps) => ({
    width: `calc(100% / ${numOfRessources})`,
    textAlign: 'center',
    color: bgColor
      ? `var(--bg${bgColor[0].toUpperCase() + bgColor.substring(1)}Text)`
      : undefined,
    fontWeight: 'bold',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'fade',
    fontSize: 'smaller',
    borderRight: calendarBorder,
  })
);

const CalendarColumnRessourceBody = styled.div(
  ({
    numOfHours,
    isWeekend,
    numOfRessources,
    isPublicHoliday,
  }: CalendarCommonProps & CalendarRessourceProps) => ({
    width: `calc(100% / ${numOfRessources})`,
    height: '100%',
    position: 'relative',
    borderBottom: calendarBorder,
    backgroundImage:
      isPublicHoliday && !isWeekend
        ? 'linear-gradient(#3393 50%, #3391 50%)'
        : isWeekend
        ? `linear-gradient(#3333 50%, ${colors.gray10} 50%)`
        : `linear-gradient(${colors.gray10} 50%, transparent 50%)`,
    backgroundSize: `1px calc(100% / ${numOfHours} * 2)`,
    borderRight: calendarBorder,
  })
);

const DayHeaderLabel = styled.div({
  pointerEvents: 'none',
  color: colors.gray80,
  fontWeight: 'bold',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: 'x-small',
  textTransform: 'capitalize',
  maxWidth: '100%',
});
const HolidayLabel = styled.div({
  pointerEvents: 'none',
  color: colors.gray80,
  fontWeight: 'bold',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: 'x-small',
  textTransform: 'capitalize',
  maxWidth: '100%',
});

export {
  HolidayLabel,
  DayHeaderLabel,
  CalendarWrapper,
  CalendarScaleItem,
  CalendarScaleTime,
  CalendarScaleHeader,
  CalendarScale,
  CalendarColumnWrapper,
  CalendarColumnDayHeader,
  CalendarColumnRessourceWrapper,
  CalendarColumnRessourceHeader,
  CalendarColumnRessourceBody,
};
