import { Button } from '@chakra-ui/react';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { Options, RRule, rrulestr } from 'rrule';
import { useCreateEvent } from '../../../hooks/events';
import { LeaveType, NewEvent } from '../../../types/Event';
import { EmployeeRessource } from '../../../types/Ressource';
import { LabelledInput } from '../../Library';
import CalendarItemModal from './CalendarItemModal';
import { ModalFooterControls } from './ModalFooterControls';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { getNewUTCDate } from '../../../helpers/dataConverter';
import { IconButton } from '../../atoms/Buttons';
import { Room } from '../../../types/Rooms';
import { isEmployeeRessource } from './CalendarColumn';
import { EventIcon } from '../../molecules/DataDisplay/Icons';
import { useViewport } from '../../../hooks/useViewport';

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
  const [currentStartTime, setCurrentStartTime] = useState<dayjs.Dayjs>(() =>
    dayjs(dateTime).hour(0).minute(0)
  );
  const [currentEndTime, setCurrentEndTime] = useState<dayjs.Dayjs>(() =>
    dayjs(dateTime).hour(23).minute(59)
  );
  const defaultLeave: NewEvent = {
    userId: uuid.toString(),
    ressourceId: uuid,
    title: '',
    startTime: currentStartTime,
    endTime: currentEndTime,
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
    dtstart: getNewUTCDate(currentStartTime),
  });

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
    const currentLeave = {
      ...newLeave,
      startTime: currentStartTime,
      endTime: currentEndTime,
    };
    if (dayjs(currentStartTime).isAfter(currentEndTime, 'day')) {
      setCurrentEndTime(currentStartTime);
    } else if (!dayjs(currentStartTime).isSame(currentEndTime, 'day')) {
      const count = 1 + currentEndTime.diff(currentStartTime, 'day');
      setRruleOptions((cur) => ({
        ...cur,
        count,
        dtstart: getNewUTCDate(currentStartTime),
      }));
    } else {
      currentLeave.rrule = '';
    }
    setNewLeave(currentLeave);
  }, [currentStartTime, currentEndTime]);

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
  const handleStartDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentStartTime(dayjs(e.currentTarget.value));
  };
  const handleEndDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentEndTime(dayjs(e.currentTarget.value));
  };
  const ModalHeaderContent = () => {
    return (
      <>
        <div>
          <div className="modal-title">
            <>
              {chosenLeaveType && newLeave.leaveType
                ? t(`calendar.leave.type.${newLeave.leaveType}`)
                : '?'}{' '}
              {ressource?.displayName
                ? t('dict.for') + ' ' + ressource.displayName
                : ''}
            </>
          </div>
          <div
            className="modal-subtitle"
            style={{
              fontSize: '0.8rem',
            }}
          >
            {currentStartTime.format('llll')}
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
          <LabelledInput
            disabled={!chosenLeaveType}
            label={t('calendar.event.start')}
            id="startDate"
            autoComplete="off"
            type="date"
            name="startDate"
            value={dayjs(currentStartTime).format('YYYY-MM-DD')}
            onChangeHandler={handleStartDateChange}
          />
          <LabelledInput
            disabled={!chosenLeaveType}
            label={t('calendar.event.start')}
            id="endDate"
            autoComplete="off"
            type="date"
            name="endDate"
            value={dayjs(currentEndTime).format('YYYY-MM-DD')}
            onChangeHandler={handleEndDateChange}
          />
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
