/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx} from '@emotion/react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Button, CircleButton, FormGroup, Input, Label } from '../Library';
import * as mq from '../../styles/media-queries';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarEventInputProps {
  id: number;
  dateTime: Dayjs;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
interface FormElements extends HTMLFormControlsCollection {
  eventTitleInput: HTMLInputElement
}
interface eventTitleFormElement extends HTMLFormElement {
  elements: FormElements
}

function CalendarEventInput ({id, dateTime, isOpen, onOpen, onClose}: CalendarEventInputProps): JSX.Element {
  console.log(id, dateTime.format('YYYYMMDD hh:mm'));
  const { t } = useTranslation();
  const [newEvent, setNewEvent] = useState({
    title: t('calendar.event.newAppointmentTitle'),
    startTime: dateTime,
    duration: 45,
    endTime: dayjs(dateTime).add(45, 'minute'),
    isRecurring: false,
    isHomeVisit: false,
    frequency: 'WEEKLY',
    count: 10,
    rruleString: '',
  });

  function handleSubmit (event: React.FormEvent<eventTitleFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    // console.log(event.currentTarget.elements.eventTitleInput.value);
    console.log(fieldValues);
  }
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
              padding: '1rem',
              [mq.small]: {
                width: '100%',
                margin: '10vh auto',
              }
            }}
          >
            <form onSubmit={handleSubmit} >
              <ModalHeader>{t('calendar.event.newAppointmentTitle')} {newEvent.startTime.format('YYYYMMDD')}</ModalHeader>
              <CircleButton onClick={onClose}>X</CircleButton>
              <ModalBody>
                New Appointment for User: {id} starting {newEvent.startTime.format('YYYYMMDD hh:mm')}
                <FormGroup>
                  <Label htmlFor="eventTitleInput">Title</Label>
                  <Input id="eventTitleInput" name="title" value={newEvent.title} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="eventStartDatePicker">Start</Label>
                  <DatePicker
                    id="eventStartDatePicker"
                    name="startDate"
                    showTimeSelect
                    timeFormat="p"
                    timeIntervals={15}
                    dateFormat="Pp"
                    selected={newEvent.startTime.toDate()}
                    onChange={date => console.log(date)}/>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose}>
                  {t('button.close')}
                </Button>
                <Button type="submit">
                  {t('button.save')}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;