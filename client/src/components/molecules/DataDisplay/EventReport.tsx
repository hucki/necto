import { StatGroup, Tag } from '@chakra-ui/react';
import React from 'react';
import { Event, CancellationReason } from '../../../types/Event';
import { CounterOfDone } from './CounterOfDone';
import StatTile from './StatTile';

interface EventReportProps {
  events: Event[];
  useStatGroup?: boolean;
  dateRangeLabel: string;
}

const EventReport = ({
  events,
  useStatGroup = false,
  dateRangeLabel,
}: EventReportProps) => {
  type EventStats = {
    total: number;
    done: number;
    cancelled: number;
    cancelledPerReason: {
      [key: CancellationReason['id']]: number;
    };
  };
  const defaultStats: EventStats = {
    total: 0,
    done: 0,
    cancelled: 0,
    cancelledPerReason: {},
  };

  const stats = events.reduce((prev, cur) => {
    const previousCancelledPerReason = prev.cancelledPerReason;

    if (cur.isCancelled) {
      const cancelledReasonId = cur.cancellationReasonId;
      previousCancelledPerReason[`${cancelledReasonId}`] =
        (prev.cancelledPerReason[`${cancelledReasonId}`] || 0) + 1;
    }
    const next = {
      cancelledPerReason: previousCancelledPerReason,
      total: prev.total + (cur.isCancelled ? 1 : 0),
      done: prev.done + (cur.isDone ? 1 : 0),
      cancelled: prev.cancelled + (cur.isCancelled ? 1 : 0),
    };
    return next;
  }, defaultStats);
  let cancelledHelpText = '';

  const cancelledKeys = Object.keys(stats.cancelledPerReason);
  for (let i = 0; i < cancelledKeys.length; i++) {
    const key = cancelledKeys[i];
    cancelledHelpText += `${cancelledHelpText.length ? ' | ' : ''}${key}: ${
      stats.cancelledPerReason[key]
    }`;
  }

  return (
    <>
      {useStatGroup ? (
        <StatGroup w="250px">
          <StatTile label="done" stats={stats} helpText={dateRangeLabel} />
          <StatTile
            label="cancelled"
            stats={{ total: stats.cancelled }}
            helpText={cancelledHelpText}
          />
        </StatGroup>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gap: '0.1rem',
          }}
        >
          <CounterOfDone done={stats.done} total={stats.total} />
          <Tag size="sm" colorScheme="blue">
            {stats.cancelled
              ? stats.cancelled + ' (' + cancelledHelpText + ')'
              : 0}
          </Tag>
        </div>
      )}
    </>
  );
};

export default EventReport;
