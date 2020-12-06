/** @jsx jsx */
import {jsx} from '@emotion/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react"
import { Dayjs } from 'dayjs';

interface CalendarEventInputProps {
  id: number;
  dateTime: Dayjs;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function CalendarEventInput({id, dateTime, isOpen, onOpen, onClose}: CalendarEventInputProps): JSX.Element {

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {id + dateTime.format('YYYYMMDD hh:mm')}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CalendarEventInput;