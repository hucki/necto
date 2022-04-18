import { useBreakpointValue } from '@chakra-ui/react';

export const useViewport = () => {
  const viewport = useBreakpointValue({ base: 'mobile', md: 'desktop' });
  return {
    isMobile: viewport === 'mobile',
    isDesktop: viewport !== 'mobile',
  };
};
