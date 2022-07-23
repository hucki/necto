import styled from '@emotion/styled/macro';

interface CalendarEntryContainerProps {
  bgColor?: string
}

const CalendarEntryContainer = styled.div({
  position: 'absolute',
  width: '98%',
  marginLeft: '1%',
  minHeight: '2rem',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  fontSize: '0.7em',
  fontWeight: '300',
  justifyContent: 'space-between',
  overflow: 'hidden',
  borderBottomRightRadius: '0.5rem',
  borderTop: '2px solid',
  boxShadow: '0.1rem 0.2rem 2px #3333',
  transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
},
({bgColor}:CalendarEntryContainerProps)=> {
  const styles = {
    backgroundColor: '',
    borderColor: '',
  };
  if (bgColor) {
    styles.backgroundColor = `var(--bg${bgColor[0].toUpperCase() + bgColor.substring(1)})`;
    styles.borderColor = `var(--bg${bgColor[0].toUpperCase() + bgColor.substring(1)}Border)`;
  }
  return styles;
}
);

export {CalendarEntryContainer};
