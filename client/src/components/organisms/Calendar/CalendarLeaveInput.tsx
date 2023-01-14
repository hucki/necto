import { Button, FormControl } from '@chakra-ui/react';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { Options, RRule, rrulestr } from 'rrule';
import { useCreateEvent } from '../../../hooks/events';
import { LeaveType, NewEvent } from '../../../types/Event';
import { EmployeeRessource } from '../../../types/Ressource';
import { DatePicker, FormLabel } from '../../Library';
import CalendarItemModal from './CalendarItemModal';
import { ModalFooterControls } from './ModalFooterControls';
import { registerLocale } from 'react-datepicker';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import de from 'date-fns/locale/de';
import { getNewUTCDate } from '../../../helpers/dataConverter';
import { IconButton } from '../../atoms/Buttons';
import { Room } from '../../../types/Rooms';
import { isEmployeeRessource } from './CalendarColumn';
import { EventIcon } from '../../molecules/DataDisplay/Icons';
import { useViewport } from '../../../hooks/useViewport';

registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface CalendarLeaveInputProps {
  uuid: string;
  ressource: EmployeeRessource | Room;
  dateTime: Dayjs;
  isOpen: boolean;
  onClose: () => void;
}

const CalendarLeaveInput = ({
  uuid,
  ressource,
  dateTime,
  isOpen,
  onClose,
}: CalendarLeaveInputProps) => {
  const { t } = useTranslation();
  const { isMobile } = useViewport();

  const defaultLeave: NewEvent = {
    userId: uuid.toString(),
    ressourceId: uuid,
    title: '',
    startTime: dayjs(dateTime).hour(0).minute(0),
    endTime: dayjs(dateTime).hour(23).minute(59),
    isAllDay: true,
    type: 'leave',
    leaveType: 'paidVacation',
    leaveStatus: 'requested',
    bgColor: isEmployeeRessource(ressource) ? ressource.bgColor : 'green',
    isRecurring: false,
    isHomeVisit: false,
    isDiagnostic: false,
    isDone: false,
    rrule: '',
    isCancelled: false,
    isCancelledReason: '',
    roomId: '',
    patientId: '',
  };

  const [newLeave, setNewLeave] = useState<NewEvent>(defaultLeave);
  const [chosenLeaveType, setChosenLeaveType] = useState<LeaveType>();
  const { mutateAsync: createEvent } = useCreateEvent();
  const [rruleOptions, setRruleOptions] = useState<Partial<Options>>({
    freq: RRule.DAILY,
    interval: 1,
    // FIXME: current version of rrule.all() yields invalid dates
    // when tzid is used. Quickfix: comment out tzid
    // https://github.com/jakubroztocil/rrule/issues/523
    // tzid: 'Europe/Amsterdam',
    count: 1,
    dtstart: getNewUTCDate(newLeave.startTime),
  });

  type TimeChangeProps = {
    date: ReactDatePickerReturnType;
    key: 'startTime' | 'endTime';
  };
  function handleTimeChange({ date, key }: TimeChangeProps) {
    if (date) {
      setNewLeave((cur) => ({
        ...cur,
        [`${key}`]: dayjs(date.toString()),
      }));
    }
  }

  async function handleSubmit() {
    if (newLeave) {
      try {
        const createdEvent = await createEvent({
          event: newLeave,
        });
        // create events from rrule if event was created and has rrule
        if (!createdEvent || !createdEvent.rrule) {
          onClose();
          return;
        }
        const rruleObj = rrulestr(createdEvent.rrule);
        const rruleList = rruleObj?.all();
        if (rruleList && rruleList.length > 1) {
          const currentTZHour = dayjs.utc(rruleList[0]).local().hour();
          for (let i = 1; i < rruleList.length; i++) {
            const dt = dayjs(rruleList[i]).hour(currentTZHour);
            const nextEvent = newLeave;
            nextEvent.parentEventId = createdEvent.uuid;
            nextEvent.startTime = dt;
            nextEvent.endTime = dt.hour(23).minute(59);
            await createEvent({
              event: nextEvent,
            });
          }
        }
        onClose();
      } catch (error) {
        console.error('event could not be created', { error });
      }
    }
  }

  useEffect(() => {
    if (!dayjs(newLeave.startTime).isSame(newLeave.endTime, 'day')) {
      const count = 1 + newLeave.endTime.diff(newLeave.startTime, 'day');
      setRruleOptions((cur) => ({
        ...cur,
        count,
        dtstart: getNewUTCDate(newLeave.startTime),
      }));
    } else {
      setNewLeave((cur) => ({ ...cur, rrule: '' }));
    }
  }, [newLeave.startTime, newLeave.endTime]);

  useEffect(() => {
    const rrule = new RRule(rruleOptions);
    if (rruleOptions?.count && rruleOptions.count > 1) {
      setNewLeave((cur) => ({ ...cur, rrule: rrule.toString() }));
    } else if (newLeave.rrule !== '') {
      setNewLeave((cur) => ({ ...cur, rrule: '' }));
    }
  }, [rruleOptions]);

  useEffect(() => {
    if (chosenLeaveType && chosenLeaveType !== newLeave.leaveType) {
      setNewLeave((currentLeave) => ({
        ...currentLeave,
        leaveType: chosenLeaveType,
      }));
    }
  }, [chosenLeaveType]);

  const ModalHeaderContent = () => {
    return (
      <>
        <div>
          <div className="modal-title">
            {chosenLeaveType
              ? t(`calendar.leave.type.${newLeave.leaveType}`)
              : '?'}{' '}
            {ressource?.displayName
              ? t('dict.for') + ' ' + ressource.displayName
              : ''}
          </div>
          <div
            className="modal-subtitle"
            style={{
              fontSize: '0.8rem',
            }}
          >
            {newLeave.startTime.format('llll')}
          </div>
        </div>
        {newLeave.leaveType === 'sick' && <EventIcon type="sick" size="l" />}
        <IconButton
          aria-label="close modal"
          icon={<FaTimes />}
          onClick={onClose}
        />
      </>
    );
  };

  const ChooseLeave = () => {
    return (
      <>
        <Button onClick={() => setChosenLeaveType('paidVacation')}>
          UrlaubsAntrag
        </Button>
        <Button onClick={() => setChosenLeaveType('sick')}>Krankmeldung</Button>
      </>
    );
  };
  const ModalBodyContent = () => (
    <>
      {!chosenLeaveType ? (
        <ChooseLeave />
      ) : (
        <>
          <FormControl id="eventStartDatePicker" mb="0.75rem">
            <DatePicker
              name="startDate"
              disabled={!chosenLeaveType}
              locale="de"
              dateFormat="E dd.MM.yyyy"
              selected={dayjs(newLeave.startTime).toDate()}
              onChange={(date: ReactDatePickerReturnType) => {
                if (date) handleTimeChange({ date, key: 'startTime' });
              }}
            />
            <FormLabel>{t('calendar.event.start')}</FormLabel>
          </FormControl>

          <FormControl id="eventEndDatePicker" mb="0.75rem">
            <DatePicker
              name="endDate"
              disabled={!chosenLeaveType}
              locale="de"
              dateFormat="E dd.MM.yyyy"
              selected={dayjs(newLeave.endTime).toDate()}
              onChange={(date: ReactDatePickerReturnType) => {
                if (date) handleTimeChange({ date, key: 'endTime' });
              }}
            />
            <FormLabel>{t('calendar.event.end')}</FormLabel>
          </FormControl>
        </>
      )}
    </>
  );
  return (
    <>
      <CalendarItemModal
        isOpen={isOpen}
        onClose={onClose}
        size={isMobile ? 'full' : undefined}
        modalHeader={<ModalHeaderContent />}
        headerBgColor={newLeave.bgColor || 'green'}
        modalBody={<ModalBodyContent />}
        modalFooter={
          <ModalFooterControls
            onClose={onClose}
            onSubmit={chosenLeaveType ? handleSubmit : undefined}
          />
        }
      ></CalendarItemModal>
    </>
  );
};

export default CalendarLeaveInput;
