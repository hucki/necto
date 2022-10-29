import {
  ModalContent as ChakraModalContent,
  ModalHeader as ChakraModalHeader,
  ModalBody as ChakraModalBody,
  ModalFooter as ChakraModalFooter,
  ModalOverlay as ChakraModalOverlay,
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import { BgColor } from '../../types/Colors';

const ModalOverlay = styled(ChakraModalOverlay)({
  backgroundColor: 'rgba(0,0,0,0.3)',
});

const ModalContent = styled(ChakraModalContent)({
  display: 'grid',
  gridTemplateRows: '1fr 6fr 1fr',
  maxWidth: '450px',
  borderRadius: '3px',
  backgroundColor: 'white',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
});

interface ModalHeaderProps {
  bgColor?: BgColor;
}
const ModalHeader = styled(ChakraModalHeader)(
  {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
  },
  ({ bgColor = 'green' }: ModalHeaderProps) => {
    return {
      backgroundColor: `var(--bg${
        bgColor[0].toUpperCase() + bgColor.substring(1)
      })`,
    };
  }
);

const ModalBody = styled(ChakraModalBody)(
  {
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  ({ bgColor }: ModalHeaderProps) => {
    if (bgColor) {
      return {
        backgroundColor: `var(--bg${
          bgColor[0].toUpperCase() + bgColor.substring(1)
        })`,
      };
    }
  }
);
const ModalFooter = styled(ChakraModalFooter)(
  {
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  ({ bgColor }: ModalHeaderProps) => {
    if (bgColor) {
      return {
        backgroundColor: `var(--bg${
          bgColor[0].toUpperCase() + bgColor.substring(1)
        })`,
      };
    }
  }
);
export { ModalContent, ModalHeader, ModalBody, ModalFooter, ModalOverlay };
