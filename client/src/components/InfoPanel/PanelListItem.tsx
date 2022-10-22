import { Box, Tag } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CgCheck } from 'react-icons/cg';
import { Event } from '../../types/Event';
import { IconButton } from '../atoms/Buttons';

type PanelListItemProps = {
  event: Event;
  handleApproveLeave?: ({ leave }: { leave: Event }) => void;
};

export const PanelListItem = ({
  event,
  handleApproveLeave,
}: PanelListItemProps) => {
  const { t } = useTranslation();
  const isLeave = event.type === 'leave';
  const startTimeString = `${dayjs(event.startTime).format('HH:mm')}`;
  const firstDay = dayjs(event.startTime).format('ddd DD.MM.YYYY');
  const lastDay = dayjs(event.endTime).format('ddd DD.MM.YYYY');
  const entryTitle = isLeave
    ? t(`calendar.leave.type.${event.leaveType}`) +
      (event.leaveStatus === 'requested'
        ? ' (' + t(`calendar.leave.status.${event.leaveStatus}`) + ')'
        : '')
    : event.patient
    ? event.patient.lastName + ', ' + event.patient.firstName
    : event.title;
  return (
    <>
      <Box
        display="grid"
        gridTemplate={
          '"date date date" auto "tag info controls" auto / 4rem auto 42px'
        }
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
            gridArea: 'tag',
            justifySelf: 'left',
            alignSelf: 'center',
            marginRight: '1rem',
          }}
        >
          {isLeave && (
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
          )}
          {!isLeave && <b>{startTimeString}</b>}
        </div>
        <div className="user-data" style={{ gridArea: 'info' }}>
          {!isLeave && entryTitle}
          {isLeave &&
            !handleApproveLeave &&
            event.leaveStatus === 'requested' &&
            t(`calendar.leave.status.${event.leaveStatus}`)}
          {handleApproveLeave &&
            event.employee?.lastName + ', ' + event.employee?.firstName + ' '}
        </div>
        <div
          style={{
            fontSize: 'small',
            gridArea: 'date',
          }}
        >
          {firstDay}
          {firstDay != lastDay ? ` - ${lastDay}` : ''}
        </div>

        <div
          className="controls"
          style={{
            gridArea: 'controls',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {handleApproveLeave && (
            <IconButton
              size="sm"
              aria-label="block user"
              colorScheme="green"
              icon={<CgCheck size="2rem" />}
              onClick={() => handleApproveLeave({ leave: event })}
            />
          )}
        </div>
      </Box>
    </>
  );
};
