import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

const AppContainer = styled.div({
  width: '100vw',
  maxWidth: '100vw',
  height: '100vh',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'row',
});

interface SidebarProps {
  collapsed?: boolean;
}
const Sidebar = styled.div(
  {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
    height: '100%',
    backgroundColor: 'white',
    transition: 'all 0.1s ease-in',
  },
  ({ collapsed }: SidebarProps) =>
    collapsed ? { width: '52px'} : { width: '200px', zIndex: '1', position: 'absolute'  }
);

const ContentContainer = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  overflow: 'scroll',
  flexDirection: 'column',
});

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  width: '100%',
  height: 'clamp(52px, 5vh)',
  backgroundColor: 'white',
});

const Content = styled(Box)({
  width: '100%',
  height: '100%',
});

const Footer = styled.div({
  width: '100%',
  height: '5vh',
  padding: '10px',
  textAlign: 'right',
  boxShadow: '0 0 15px #3333',
});

export { AppContainer, Sidebar, Header, Content, ContentContainer, Footer };
