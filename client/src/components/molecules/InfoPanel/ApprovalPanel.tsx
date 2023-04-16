import { VStack } from '@chakra-ui/react';
import React from 'react';
import { useApproveLeave } from '../../../hooks/events';
import { Event } from '../../../types/Event';
import { PanelListItem } from './PanelListItem';
import dayjs from 'dayjs';

interface ApprovalPanelProps {
  events: Event[];
}
const ApprovalPanel = ({ events }: ApprovalPanelProps) => {
  const { mutateAsync: approveLeave } = useApproveLeave();
  const handleApproveLeave = ({ leave }: { leave: Event }) => {
    approveLeave({ event: leave });
  };
  const eventsToApprove = events ? (
    events
      .sort(
        (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
      )
      .map((event) => (
        <PanelListItem
          key={event.uuid}
          event={event}
          handleApproveLeave={handleApproveLeave}
        />
      ))
  ) : (
    <div>no leave to approve</div>
  );

  return (
    <>
      <div className="user-wrapper">
        <VStack>{eventsToApprove}</VStack>
      </div>
    </>
  );
};

export default ApprovalPanel;
