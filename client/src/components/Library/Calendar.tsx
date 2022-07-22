import styled from '@emotion/styled/macro';
import * as colors from '../../styles/colors';

type CalendarCommonProps = {
  numOfHours: number
}

type CalendarScaleProps = {
  scaleWidth: string
}

type CalendarColumnProps = CalendarCommonProps & {
  isToday: boolean
}

type CalendarRessourceProps = {
  numOfRessources: number
  index: number
  bgColor: string
}

const CalendarWrapper = styled.div(({numOfHours}:CalendarCommonProps) => ({
  position: 'relative',
  fontSize: '1rem',
  height: '100%',
  width: '100%',
  display: 'flex',
  overflow: 'scroll',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  textAlign: 'right',
  backgroundColor: '#fff',
  backgroundImage: `linear-gradient(${colors.gray20} 50%, transparent 50%)`,
  // backgroundImage: 'linear-gradient(#f0f2f5 50%, transparent 50%)',
  backgroundSize: `1px calc(100% / ${numOfHours + 1} * 2)`,
}));

const CalendarScale = styled.div(({scaleWidth}:CalendarScaleProps) => ({
  width: scaleWidth,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRight: `1px solid ${colors.gray50}`
}));
const CalendarScaleHeader = styled.div(({numOfHours}:CalendarCommonProps) => ({
  height: `calc(100% / ${numOfHours + 1})`,
  backgroundColor: `${colors.base}`,
}));

const CalendarScaleItem = styled.div(({numOfHours}:CalendarCommonProps) => ({
  height: `calc(100% / ${numOfHours + 1})`,
  fontStyle: 'italic',
  fontSize: 'small',
  backgroundColor: `${colors.base}`,
  borderTop: '1px solid',
  borderImageSlice: '1',
  // borderImageSource: 'linear-gradient(to left, #743ad5, #d53a9d)',
  borderImageSource: `linear-gradient(to right, ${colors.base}, ${colors.gray50})`,
}));

const CalendarScaleTime = styled.div({
  position: 'relative',
  top: '-10px',
  textAlign: 'left',
  fontSize: '0.7rem'
});

const CalendarColumnWrapper = styled.div({
  width: '100%',
  textAlign: 'center',
});

const CalendarColumnDayHeader = styled.div(({numOfHours, isToday}:CalendarColumnProps) => ({
  height: `calc((100% / ${numOfHours + 1}) / 2)`,
  backgroundColor: `${colors.base}`,
  color: `${colors.gray}`,
  fontWeight: isToday ? 'bold' : undefined,
  borderRight: `1px solid ${colors.gray50}`,
  borderTop: isToday ? '0.2rem solid red' : undefined,
}));

const CalendarColumnRessourceWrapper = styled.div(({numOfHours}:CalendarCommonProps) => ({
  display: 'flex',
  height: `calc((100% / ${numOfHours + 1}) / 2)`,
  flexDirection: 'row',
  borderBottom: `2px solid ${colors.gray50}`
}));

const CalendarColumnRessourceHeader = styled.div(({numOfRessources, index, bgColor}:CalendarRessourceProps) => ({
  width: `calc(100% / ${numOfRessources})`,
  textAlign: 'center',
  color: bgColor ? `var(--bg${bgColor[0].toUpperCase() + bgColor.substring(1)}Text)` : undefined,
  fontWeight: 'bold',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'fade',
  borderRight:
    index === numOfRessources - 1
      ? `2px solid ${colors.gray50}`
      : '1px dashed #3333',
}));

export {
  CalendarWrapper,
  CalendarScaleItem,
  CalendarScaleTime,
  CalendarScaleHeader,
  CalendarScale,
  CalendarColumnWrapper,
  CalendarColumnDayHeader,
  CalendarColumnRessourceWrapper,
  CalendarColumnRessourceHeader
};