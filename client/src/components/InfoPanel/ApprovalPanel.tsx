import { Box, Heading, Tag, TagLeftIcon, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CgCheck } from 'react-icons/cg';
import { useApproveLeave, useLeavesByStatus } from '../../hooks/events';
import { Event } from '../../types/Event';
import { IconButton } from '../Library';

type ListItemProps = {
  event: Event;
};

const ListItem = ({ event }: ListItemProps) => {
  const { t } = useTranslation();
  const [approveLeave] = useApproveLeave();
  const firstDay = dayjs(event.startTime).format('ddd DD.MM.YYYY');
  const lastDay = dayjs(event.endTime).format('ddd DD.MM.YYYY');
  const handleApproveLeave = ({ leave }: { leave: Event }) => {
    approveLeave({ event: leave });
  };
  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="4rem auto 42px"
        gridTemplateAreas="tags date controls"
        justifyItems="stretch"
        p="1"
        width="100%"
        border="1px solid #3333"
        borderRadius="0.5rem"
        paddingLeft="0.5rem"
      >
        <div
          className="tags"
          style={{
            justifySelf: 'left',
            alignSelf: 'center',
            marginRight: '1rem',
          }}
        >
          <Tag
            size="sm"
            variant="solid"
            colorScheme={
              event.leaveType === 'sick' || event.leaveType === 'sickChild'
                ? 'orange'
                : 'teal'
            }
          >
            {t(`calendar.leave.type.${event.leaveType}`)}
          </Tag>
        </div>
        <div className="user-data">
          {event.employee?.lastName}, {event.employee?.firstName} -{' '}
          <b>
            {firstDay}
            {firstDay != lastDay ? ` - ${lastDay}` : ''}
          </b>
        </div>

        <div
          className="controls"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            size="sm"
            aria-label="block user"
            colorScheme="green"
            icon={<CgCheck size="2rem" />}
            onClick={() => handleApproveLeave({ leave: event })}
          />
        </div>
      </Box>
    </>
  );
};

const ApprovalPanel = () => {
  const { rawEvents: events } = useLeavesByStatus('requested');

  const uniqueRequests = events.filter(
    (event) => event.rrule === '' || !event.parentEventId
  ).length;

  const eventsToApprove = events ? (
    events
      .filter((event) => event.rrule === '' || !event.parentEventId)
      .map((event) => <ListItem key={event.uuid} event={event} />)
  ) : (
    <div>no leave to approve</div>
  );

  return (
    <>
      <div className="user-wrapper">
        <Heading as="h2" size="md" mb="2">
          offene Anträge ({uniqueRequests})
        </Heading>
        <VStack>{eventsToApprove}</VStack>
      </div>
    </>
  );
};

export default ApprovalPanel;
