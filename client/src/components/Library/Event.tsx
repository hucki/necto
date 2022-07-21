import styled from '@emotion/styled/macro';

interface CalendarEntryContainerProps {
  isNote?: boolean
  bgColor?: string
}

const CalendarEntryContainer = styled.div({
  position: 'absolute',
  width: '98%',
  marginLeft: '1%',
  minHeight: '2rem',
  /* height: '15vh', */
  /* lineHeight: '15vh', */
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  fontSize: '0.7em',
  fontWeight: '300',
  justifyContent: 'space-between',
  /* display: 'grid', */
  /* gridTemplate-columns: 'auto', */
  overflow: 'hidden',
  borderRadius: '0 0.2rem 0 0.2rem',
  /* border-Radius: '0.5rem', */
  borderTop: '2px solid',
  boxShadow: '0.2rem 0.2rem 2px #3333',
  transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
},
({isNote, bgColor}:CalendarEntryContainerProps)=> {
  const styles = {
    backgroundColor: '',
    borderColor: '',
    background: '',
    borderBottomRightRadius: '',
  };
  if (bgColor) {
    styles.backgroundColor = `var(--bg${bgColor[0].toUpperCase() + bgColor.substring(1)})`;
    styles.borderColor = `var(--bg${bgColor[0].toUpperCase() + bgColor.substring(1)}Border)`;
  }
  if (isNote) {
    styles.background = 'linear-gradient(135deg, khaki 90%, darkgrey)';
    styles.borderBottomRightRadius = '0.5rem';
    styles.borderColor = 'darkkhaki';
  }
  return styles;
}
);

export {CalendarEntryContainer};
