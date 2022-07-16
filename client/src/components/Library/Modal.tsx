import * as mq from '../../styles/media-queries';
import { ModalContent, ModalHeader, ModalBody } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import { BgColor } from '../../types/Colors';

const EventModalContent = styled(ModalContent)({
  display: 'grid',
  gridTemplateRows: '1fr 6fr 1fr',
  maxWidth: '450px',
  borderRadius: '3px',
  backgroundColor: 'white',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  // margin: '20vh auto',
  // [mq.small]: {
  // width: '100vw',
  // margin: '10vh auto',
  // },
});

interface EventModalHeaderProps {
  bgColor: BgColor;
}
const EventModalHeader = styled(ModalHeader)(
  {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
  },
  ({ bgColor = 'green' }: EventModalHeaderProps) => {
    return {
      backgroundColor: `var(--bg${
        bgColor[0].toUpperCase() + bgColor.substring(1)
      })`,
    };
  }
);

const EventModalBody = styled(ModalBody)({
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
});
export { EventModalContent, EventModalHeader, EventModalBody };
