import { VStack } from '@chakra-ui/react';
import React from 'react';
import { Event } from '../../../types/Event';
import { PanelListItem } from './PanelListItem';

interface UpcomingPanelProps {
  events: Event[];
}
const UpcomingPanel = ({ events }: UpcomingPanelProps) => {
  const upcomingEvents = events ? (
    events.map((event) => <PanelListItem key={event.uuid} event={event} />)
  ) : (
    <div>no leave to approve</div>
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
