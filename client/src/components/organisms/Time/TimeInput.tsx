import React, { useState } from 'react';
import { LabelledInput } from '../../Library';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import { TimeType, Times } from './Time';

const TimeWrapper = styled.div({
  display: 'grid',
  gridAutoFlow: 'row',
  alignItems: 'center',
  gridAutoColumns: 'max-content',
});

interface TimeInputProps {
  type: TimeType;
  // eslint-disable-next-line no-unused-vars
  onAddBooking: ({ currentTimes }: { currentTimes: Times }) => Promise<void>;
}
const TimeInput = ({ type = 'workingHours', onAddBooking }: TimeInputProps) => {
  const { t } = useTranslation();
  const now = new Date();
  const [currentTimes, setCurrentTimes] = useState<Times>(() => ({
    type,
    start: dayjs(now).format('HH:mm'),
    end: dayjs(now).format('HH:mm'),
  }));
  const minutesDiff = dayjs(currentTimes.end).diff(
    dayjs(currentTimes.start),
    'minute'
  );
  const isDisabled = minutesDiff < 1;
  const handleAddBooking = () => {
    onAddBooking({ currentTimes });
  };
  const handleTimeChange = (
    e: React.FormEvent<HTMLInputElement>,
    type: 'start' | 'end'
  ) => {
    setCurrentTimes({
      ...currentTimes,
      [type]: dayjs(e.currentTarget.value).format('YYYY-MM-DDTHH:mm'),
    });
  };
  return (
    <TimeWrapper>
      {type}
      <LabelledInput
        label={t('calendar.event.start')}
        id="start"
        autoComplete="off"
        type="time"
        name="start"
        value={dayjs(currentTimes.start).format('HH:mm')}
        onChangeHandler={(e) => handleTimeChange(e, 'start')}
      />
      <LabelledInput
        label={t('calendar.event.end')}
        id="end"
        autoComplete="off"
        type="time"
        name="end"
        value={dayjs(currentTimes.end).format('HH:mm')}
        onChangeHandler={(e) => handleTimeChange(e, 'end')}
      />
      <Button
        isDisabled={isDisabled}
        className="add-booking"
        onClick={handleAddBooking}
      >
        add {type}
      </Button>
    </TimeWrapper>
  );
};

export default TimeInput;
