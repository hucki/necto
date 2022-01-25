/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Button, CircleButton, FormGroup, Input, Label } from '../Library';
import * as mq from '../../styles/media-queries';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateEvent } from '../../hooks/events';
import { Appointment, Event } from '../../types/Event';
import { appointment2Event } from '../../helpers/dataConverter';
import { EmployeeRessource, Room } from '../../types/Ressource';
import de from 'date-fns/locale/de';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

interface CalendarEventInputProps {
  uuid: string;
  ressource: EmployeeRessource | Room;
  dateTime: Dayjs;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
interface FormElements extends HTMLFormControlsCollection {
  eventTitleInput: HTMLInputElement;
}
interface eventTitleFormElement extends HTMLFormElement {
  elements: FormElements;
}

function CalendarEventInput({
  uuid,
  ressource,
  dateTime,
  isOpen,
  onOpen,
  onClose,
}: CalendarEventInputProps): JSX.Element {
  const { t } = useTranslation();
  const [newEvent, setNewEvent] = useState<Appointment>({
    rowId: uuid.toString(),
    ressourceId: uuid,
    title: t('calendar.event.newAppointmentTitle'),
    startTime: dateTime,
    duration: 45,
    endTime: dayjs(dateTime).add(45, 'minute'),
    isRecurring: false,
    isHomeVisit: false,
    frequency: 'WEEKLY',
    count: 10,
    rruleString: '',
    rrule: '',
    bgColor: ressource?.bgColor || 'green',
  });
  const [createEvent, { error: savingError }] = useCreateEvent();

  // console.log('startEnd', newEvent.startTime, newEvent.endTime);
  useEffect(() => {
    setNewEvent({
      ...newEvent,
      startTime: dateTime,
      endTime: dayjs(dateTime).add(45, 'minute'),
    });
  }, [dateTime]);

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setNewEvent({
      ...newEvent,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  function handleStartTimeChange(date: Date) {
    setNewEvent({
      ...newEvent,
      startTime: dayjs(date),
    });
  }

  function handleEndTimeChange(date: Date) {
    setNewEvent({
      ...newEvent,
      endTime: dayjs(date),
    });
  }

  function handleSubmit(event: React.FormEvent<eventTitleFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    setNewEvent({ ...newEvent, ...fieldValues });
    const submitEvent: Event | undefined = appointment2Event(
      { ...newEvent, ...fieldValues, bgColor: ressource.bgColor },
      uuid
    );
    if (submitEvent)
      createEvent({
        event: submitEvent,
      });
    onClose();
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
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
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              <ModalHeader
                css={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'cornflowerblue',
                  padding: '0.5rem',
                }}
              >
                <div>
                  <div className="modal-title">
                    {t('calendar.event.newAppointmentTitle')} {t('dict.for')}{' '}
                    {ressource.displayName}
                  </div>
                  <div
                    className="modal-subtitle"
                    css={{
                      fontSize: '0.8rem',
                    }}
                  >
                    {newEvent.startTime.format('llll')}
                  </div>
                </div>
                <CircleButton
                  type="button"
                  className="modal-close"
                  onClick={onClose}
                >
                  X
                </CircleButton>
              </ModalHeader>
              <ModalBody
                css={{
                  padding: '0.5rem',
                }}
              >
                <FormGroup>
                  <Label htmlFor="eventTitleInput">Title</Label>
                  <Input
                    id="eventTitleInput"
                    name="title"
                    value={newEvent.title}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="eventStartDatePicker">
                    {t('calendar.event.start')}
                  </Label>
                  <DatePicker
                    id="eventStartDatePicker"
                    name="startDate"
                    showTimeSelect
                    locale="de"
                    timeFormat="p"
                    timeIntervals={15}
                    dateFormat="Pp"
                    selected={newEvent.startTime.toDate()}
                    onChange={(date) => {
                      if (date) handleStartTimeChange(date);
                    }}
                  />
                  <Label htmlFor="eventEndDatePicker">
                    {t('calendar.event.end')}
                  </Label>
                  <DatePicker
                    id="eventEndDatePicker"
                    name="endDate"
                    showTimeSelect
                    locale="de"
                    timeFormat="p"
                    timeIntervals={15}
                    dateFormat="Pp"
                    selected={newEvent.endTime.toDate()}
                    onChange={(date) => {
                      if (date) handleEndTimeChange(date);
                    }}
                  />
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button type="button" onClick={onClose} variant="secondary">
                  {t('button.close')}
                </Button>
                <Button type="submit">{t('button.save')}</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;
