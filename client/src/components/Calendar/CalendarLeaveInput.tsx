import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCommentMedical, FaTimes } from 'react-icons/fa';
import { Leave, LeaveType } from '../../types/Event';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { Button, IconButton } from '../Library';
import CalendarItemModal from './CalendarItemModal';

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

  const defaultLeave: Leave = {
    userId: uuid.toString(),
    ressourceId: uuid,
    title: '',
    startTime: dayjs(dateTime).hour(0).minute(0),
    endTime: dayjs(dateTime).hour(23).minute(59),
    isAllDay: true,
    type: 'leave',
    leaveType: 'paidVacation',
    leaveStatus: 'requested',
    bgColor: ressource?.bgColor || 'green',
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

  const [newLeave, setNewLeave] = useState<Leave>(defaultLeave);
  const [chosenLeaveType, setChosenLeaveType] = useState<LeaveType>();

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
        {newLeave.leaveType === 'sick' && (
          <FaCommentMedical
            style={{
              width: '2rem',
              height: '2rem',
            }}
          />
        )}
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
      <div>{!chosenLeaveType ? <ChooseLeave /> : <div>{uuid}</div>}</div>
    </>
  );
  return (
    <>
      <CalendarItemModal
        isOpen={isOpen}
        onClose={onClose}
        modalHeader={<ModalHeaderContent />}
        headerBgColor={newLeave.bgColor || 'green'}
        modalBody={<ModalBodyContent />}
        modalFooter={<ModalBodyContent />}
      ></CalendarItemModal>
    </>
  );
};

export default CalendarLeaveInput;
