import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

const App = styled.div({
  width: '100vw',
  height: '100vh',
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
    collapsed ? { width: '52px' } : { width: '200px' }
);

const ContentContainer = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
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

export { App, Sidebar, Header, Content, ContentContainer, Footer };