import styled from '@emotion/styled/macro';
import * as colors from '../../styles/colors';

type CalendarCommonProps = {
  numOfHours: number
}

type CalendarScaleProps = {
  scaleWidth: string
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
export {CalendarWrapper, CalendarScaleItem, CalendarScaleTime, CalendarScaleHeader, CalendarScale};