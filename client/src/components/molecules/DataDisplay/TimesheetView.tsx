import React from 'react';
import { Contract } from '../../../types/Employee';
import dayjs from 'dayjs';
import styled from '@emotion/styled/macro';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import ContractSummary from './ContractSummary';
import { useTranslation } from 'react-i18next';
import { EventsOfDay, TimesheetDay } from '../../organisms/Employee/TimeSheet';
import { Stat, StatGroup, StatLabel, StatNumber } from '@chakra-ui/react';

const TimesheetHeader = styled.div({
  padding: '0.5rem',
  marginTop: '0.5rem',
  backgroundColor: 'whitesmoke',
});
const TimeframeLabel = styled.div({
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  fontSize: '1.25rem',
  display: 'flex',
  justifyContent: 'space-between',
});
const Styles = styled.div`
  padding: 0.5rem;
  overflow: scroll;

  table {
    border-spacing: 0;
    border: 1px solid black;
    font-size: 12px;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.25rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

type TimesheetViewProps = {
  year: number;
  /**
   * zero based month -> 0 = January
   */
  month: number;
  contract: Contract;
  name: string;
  currentTimesheet: TimesheetDay[];
};
const TimesheetView = ({
  year,
  month,
  contract,
  name,
  currentTimesheet,
}: TimesheetViewProps) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper<TimesheetDay>();
  const stats = currentTimesheet.find((row) => row.dayOfMonth === 99);
  type GetInterpretedValueProps = {
    value?: string | number;
  };
  const getInterpretedValue = ({ value = '-' }: GetInterpretedValueProps) => {
    if (typeof value === 'string') return value;
    return value === 0 ? '-' : value.toFixed(2);
  };
  const columns = [
    columnHelper.group({
      id: 'day',
      header: 'Day',
      columns: [
        columnHelper.accessor('dayOfMonth', {
          header: 'Nr',
          cell: (info) => {
            const value = info.getValue();
            return value !== 99 ? value : '';
          },
        }),
        columnHelper.accessor('weekdayName', {
          header: 'Tag',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('targetTimeOfDay', {
          header: 'Soll',
          cell: (info) => getInterpretedValue({ value: info.getValue() }),
        }),
        columnHelper.accessor('plannedTimeOfDay', {
          header: 'Plan',
          cell: (info) => getInterpretedValue({ value: info.getValue() }),
        }),
        columnHelper.accessor('timeOfDay', {
          header: 'Ist',
          cell: (info) => getInterpretedValue({ value: info.getValue() }),
        }),
        columnHelper.accessor('timeDiffOfDay', {
          header: 'Diff',
          cell: (info) => {
            const value = getInterpretedValue({ value: info.getValue() });
            if (value === '-') return value;
            return (
              <b style={{ color: parseInt(value) < 0 ? 'red' : undefined }}>
                {value}
              </b>
            );
          },
        }),
      ],
    }),
    columnHelper.group({
      id: 'rest',
      header: 'Info',
      columns: [
        columnHelper.accessor('publicHolidayName', {
          header: () => t('employee.timesheet.publicHoliday'),
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('eventsOfDay', {
          header: () => t('employee.timesheet.absences'),
          cell: (info) => {
            const eventsOfDay: EventsOfDay = info.getValue();
            const hasLeaves = eventsOfDay?.leaves > 0;
            const leaveNames = eventsOfDay?.leaveStates.map(
              (state) =>
                t(`calendar.leave.type.${state.leaveType}`) +
                (state.leaveStatus === 'requested'
                  ? ' (' + t(`calendar.leave.status.${state.leaveStatus}`) + ')'
                  : '')
            );
            return hasLeaves ? leaveNames.join() : undefined;
          },
        }),
      ],
    }),
  ];

  const currentMonth = dayjs().year(year).month(month);
  const monthName = currentMonth.format('MMM');
  const table = useReactTable({
    data: currentTimesheet,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <TimesheetHeader>
        <TimeframeLabel>
          <span>{t('employee.timesheet.label')}</span>
          <span>{name}</span>
        </TimeframeLabel>
        {stats && (
          <StatGroup bg="white">
            <Stat border="1px solid gray" padding="0.25rem">
              <StatLabel>Jahr</StatLabel>
              <StatNumber>{year}</StatNumber>
            </Stat>
            <Stat border="1px solid gray" padding="0.25rem">
              <StatLabel>Monat</StatLabel>
              <StatNumber>{monthName}</StatNumber>
            </Stat>
            <Stat border="1px solid gray" padding="0.25rem">
              <StatLabel>Soll</StatLabel>
              <StatNumber>
                {getInterpretedValue({ value: stats.targetTimeOfDay })}
              </StatNumber>
            </Stat>
            {/* <Stat>
              <StatLabel>Plan</StatLabel>
              <StatNumber>
                {getInterpretedValue({ value: stats.plannedTimeOfDay })}
              </StatNumber>
            </Stat> */}
            <Stat border="1px solid gray" padding="0.25rem">
              <StatLabel>Ist</StatLabel>
              <StatNumber>
                {getInterpretedValue({ value: stats.timeOfDay })}
              </StatNumber>
            </Stat>
            <Stat border="1px solid gray" padding="0.25rem">
              <StatLabel>Diff</StatLabel>
              <StatNumber color={stats.timeDiffOfDay < 0 ? 'red' : undefined}>
                {getInterpretedValue({ value: stats.timeDiffOfDay })}
              </StatNumber>
            </Stat>
          </StatGroup>
        )}
        <div>{t('employee.timesheet.model')}:</div>
        <ContractSummary contract={contract} />
      </TimesheetHeader>
      <Styles>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isSum = row.original.dayOfMonth === 99;
              return (
                <tr
                  key={row.id}
                  style={{
                    textAlign: 'center',
                    backgroundColor: row.original.isWeekend
                      ? 'lightgray'
                      : row.original.publicHolidayName
                      ? 'lightskyblue'
                      : undefined,
                    ...(isSum
                      ? {
                          fontStyle: 'italic',
                          fontWeight: 'bold',
                          borderTop: '2px solid',
                          borderBottom: '4px double',
                        }
                      : undefined),
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Styles>
    </>
  );
};

export default TimesheetView;
