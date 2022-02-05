import styled from '@emotion/styled/macro';

const App = styled.div({
  width: '100vw',
  height: '100vh',
  backgroundColor: 'gray',
  display: 'flex',
  flexDirection: 'row',
});

const Sidebar = styled.div({
  width: '200px',
  height: '100%',
  backgroundColor: 'green',
});

const ContentContainer = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled.div({
  width: '100%',
  height: '5vh',
  backgroundColor: 'orange',
});

const Content = styled.div({
  width: '100%',
  height: '100%',
  backgroundColor: 'blue',
});

const Footer = styled.div({
  width: '100%',
  height: '5vh',
  backgroundColor: 'red',
});

export { App, Sidebar, Header, Content, ContentContainer, Footer };
