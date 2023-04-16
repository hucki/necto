import { VStack } from '@chakra-ui/react';
import React from 'react';
import { Event } from '../../../types/Event';
import { PanelListItem } from './PanelListItem';
import dayjs from 'dayjs';

interface UpcomingPanelProps {
  events: Event[];
  maxEvents?: number;
}
const UpcomingPanel = ({ events, maxEvents = 10 }: UpcomingPanelProps) => {
  const upcomingEvents = events ? (
    events
      .sort(
        (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
      )
      .filter(
        (event) =>
          (event.type === 'leave' && !event.parentEventId) ||
          event.type !== 'leave'
      )
      .map(
        (event, index) =>
          index < maxEvents && <PanelListItem key={event.uuid} event={event} />
      )
  ) : (
    <div>no upcoming events</div>
  );

  return (
    <>
      <div className="user-wrapper">
        <VStack>{upcomingEvents}</VStack>
      </div>
    </>
  );
};

export default UpcomingPanel;
