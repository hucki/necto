import styled from '@emotion/styled/macro';

interface ControlWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  justifyContent?: any;
}

const ControlWrapper = styled.div(
  ({ justifyContent }: ControlWrapperProps) => ({
    display: 'flex',
    justifyContent: justifyContent ? justifyContent : undefined,
  })
);

const PaginationWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

const wrapperStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const PersonListWrapper = styled.div(wrapperStyles, {
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const ViewWrapper = styled.div(wrapperStyles, {
  flexDirection: 'column',
  justifyContent: 'center',
});

const SettingsWrapper = styled.div({
  marginTop: '0.5rem',
  padding: '0.5rem',
  borderWidth: '1px',
  borderRadius: '12px',
});

const SettingsGrid = styled.div({
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gap: '1rem',
  alignItems: 'stretch',
  width: '100%',
  '@media (min-width: 600px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
});

const CalendarEventViewWrapper = styled.div(wrapperStyles, {
  flexDirection: 'column',
  justifyContent: 'flex-start',
});

export {
  ControlWrapper,
  PaginationWrapper,
  PersonListWrapper,
  ViewWrapper,
  CalendarEventViewWrapper,
  SettingsWrapper,
  SettingsGrid,
};
