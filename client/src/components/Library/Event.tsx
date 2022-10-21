import styled from '@emotion/styled/macro';

interface CalendarEntryContainerProps {
  bgColor?: string;
  checked?: boolean;
}

interface CalendarEntryContentProps {
  strikeThrough?: boolean;
}

const CalendarEntryContainer = styled.div(
  {
    position: 'absolute',
    width: '100%',
    minHeight: '2rem',
    '&:after': {
      position: 'absolute',
      content: '""',
      fontSize: 'large',
      fontWeight: 'bold',
      fontFamily: 'arial',
      color: '#0907',
      top: -5,
      right: 5,
      transform: 'scaleX(-1) rotate(-45deg)',
    },
  },
  ({ bgColor, checked = false }: CalendarEntryContainerProps) => {
    const styles = {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      fontSize: '0.7em',
      fontWeight: '300',
      justifyContent: 'space-between',
      overflow: 'hidden',
      borderBottomRightRadius: '0.25rem',
      borderTop: '2px solid',
      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      borderColor: '',
      '&:after': {
        content: checked ? '"L"' : '""',
      },
    };
    if (bgColor) {
      styles.backgroundColor = `var(--bg${
        bgColor[0].toUpperCase() + bgColor.substring(1)
      })`;
      styles.borderColor = `var(--bg${
        bgColor[0].toUpperCase() + bgColor.substring(1)
      }Border)`;
    }
    return styles;
  }
);

const CalendarEntryIconContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  margin: '0',
  padding: '2px',
  fonSsize: '1em',
  textShadow: '0 0 5px #3333',
  color: '#3338',
  justifyContent: 'space-between',
});

const CalendarEntryContent = styled.span(
  ({ strikeThrough }: CalendarEntryContentProps) => ({
    color: 'var(--secondary)',
    fontSize: '0.8rem',
    lineHeight: 'initial',
    textAlign: 'center',
    textDecoration: strikeThrough ? 'line-through' : undefined,
  })
);

const CalendarEntryTime = styled.span({
  color: 'black',
  fontSize: '0.6rem',
  lineHeight: 'initial',
  textAlign: 'center',
  fontWeight: 'bold',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export {
  CalendarEntryContainer,
  CalendarEntryIconContainer,
  CalendarEntryContent,
  CalendarEntryTime,
};
