import styled from '@emotion/styled/macro';

const ControlWrapper = styled.div({
  display: 'flex',
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

export { ControlWrapper, PersonListWrapper, ViewWrapper };
