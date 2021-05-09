/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx} from '@emotion/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { Button, CircleButton } from '../Library';
import * as mq from '../../styles/media-queries';
import { Dayjs } from 'dayjs';

interface CalendarEventInputProps {
  id: number;
  dateTime: Dayjs;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function CalendarEventInput ({id, dateTime, isOpen, onOpen, onClose}: CalendarEventInputProps): JSX.Element {
  console.log(id, dateTime.format('YYYYMMDD hh:mm'));
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay>
          <ModalContent
            css={{
              maxWidth: '450px',
              borderRadius: '3px',
              paddingBottom: '3.5em',
              backgroundColor: 'white',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
              margin: '20vh auto',
              [mq.small]: {
                width: '100%',
                margin: '10vh auto',
              }
            }}
          >
            <ModalHeader>New Appointment {dateTime.format('YYYYMMDD')}</ModalHeader>
            <CircleButton />
            {/* <ModalCloseButton /> */}
            <ModalBody>
              New Appointment for User: {id} starting {dateTime.format('YYYYMMDD hh:mm')}
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;