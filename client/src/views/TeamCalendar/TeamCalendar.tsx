/** @jsx jsx */
import { jsx } from '@emotion/react'
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro'
import { CalendarContainer } from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { useDaysEvents } from '../../hooks/events';
import dayjs, { Dayjs } from 'dayjs';
import { FullPageSpinner } from '../../components/Library';
import { ConsoleSqlOutlined } from '@ant-design/icons';

interface TeamCalendarInputProps {
  currentDate?: Dayjs
}

function TeamCalendar({currentDate}: TeamCalendarInputProps):JSX.Element {
  const { isLoading, error, rawEvents } = useDaysEvents(
    currentDate ? currentDate : dayjs()
  );

  if (isLoading) return <FullPageSpinner />
  console.log(rawEvents)

  return (
    <div
      css={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      TeamCalendar {currentDate?.format('DD.MM.YYYY')}
      <CalendarContainer events={rawEvents} />
    </div>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    currentDate: state.current.currentDate,
  };
};

export default connect(mapStateToProps, null)(TeamCalendar);