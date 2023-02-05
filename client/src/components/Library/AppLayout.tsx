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
    collapsed
      ? { width: '52px' }
      : { width: '200px', zIndex: '1', position: 'absolute' }
);

interface SideNavContainerProps {
  isOpen?: boolean;
}
const SideNavContainer = styled.div(
  {
    paddingTop: '3.5rem',
    height: '100%' /* 100% Full-height */,
    width: '0' /* 0 width - change this with JavaScript */,
    position: 'fixed' /* Stay in place */,
    zIndex: '2' /* Stay on top */,
    top: '0' /* Stay at the top */,
    left: '0',
    backgroundColor: 'linen',
    overflowX: 'hidden' /* Disable horizontal scroll */,
    transition:
      '0.5s' /* 0.5 second transition effect to slide in the sidenav */,
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
    // transition: 'all 0.1s ease-in',
  },
  ({ isOpen }: SideNavContainerProps) =>
    isOpen ? { width: '200px', zIndex: '10', position: 'absolute' } : null
);

const SideNavOverlay = styled.div(({ isOpen }: { isOpen: boolean }) => ({
  position: 'absolute',
  backgroundColor: '#3333',
  top: '0',
  right: '0',
  height: '100%',
  width: '100%',
  display: isOpen ? 'initial' : 'none',
  zIndex: '5' /* Stay on top */,
  backdropFilter: 'blur(0.2rem)',
  transition: 'all 0.25s ease-in',
}));

const ContentContainer = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  gridTemplateAreas: '"header" "content" "footer"',
});

const Header = styled(Box)({
  gridArea: 'header',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  width: '100%',
  height: 'clamp(52px, 5vh)',
  backgroundColor: 'linen',
  boxShadow: '-2px 0 15px #3333 inset',
});

const Content = styled(Box)({
  width: '100%',
  height: '100%',
  padding: '0.25rem',
  overflow: 'auto',
});

const Footer = styled.div({
  gridArea: 'footer',
  fontSize: 'small',
  width: '100%',
  padding: '10px',
  textAlign: 'right',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: 'linen',
  boxShadow: '2px 0 15px #3333 inset',
});

export {
  AppContainer,
  Sidebar,
  SideNavContainer,
  SideNavOverlay,
  Header,
  Content,
  ContentContainer,
  Footer,
};
