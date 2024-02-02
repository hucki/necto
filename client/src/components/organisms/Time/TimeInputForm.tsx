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

interface TimeInputFormProps {
  type: TimeType;
  // eslint-disable-next-line no-unused-vars
  onAddBooking: ({ currentTimes }: { currentTimes: Times }) => void;
}
const TimeInputForm = ({
  type = 'workingHours',
  onAddBooking,
}: TimeInputFormProps) => {
  const { t } = useTranslation();
  const now = new Date();
  const [currentTimes, setCurrentTimes] = useState<Times>(() => ({
    type,
    start: dayjs(now).format('YYYY-MM-DDTHH:mm'),
    end: dayjs(now).format('YYYY-MM-DDTHH:mm'),
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
    type: 'startTime' | 'endTime'
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
        id="startTime"
        autoComplete="off"
        type="datetime-local"
        name="startTime"
        value={dayjs(currentTimes.start).format('YYYY-MM-DDTHH:mm')}
        onChangeHandler={(e) => handleTimeChange(e, 'startTime')}
      />
      <LabelledInput
        label={t('calendar.event.end')}
        id="endTime"
        autoComplete="off"
        type="datetime-local"
        name="endTime"
        value={dayjs(currentTimes.end).format('YYYY-MM-DDTHH:mm')}
        onChangeHandler={(e) => handleTimeChange(e, 'endTime')}
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

export default TimeInputForm;
