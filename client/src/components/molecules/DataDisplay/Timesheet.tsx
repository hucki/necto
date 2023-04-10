import React from 'react';
import { Contract } from '../../../types/Employee';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled/macro';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EventsOfDay, TimesheetDay } from '../../organisms/Employee/SingleView';

const Styles = styled.div`
  padding: 0.5rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

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

type TimesheetProps = {
  year: number;
  /**
   * zero based month -> 0 = January
   */
  month: number;
  contract: Contract;
  currentTimesheet: TimesheetDay[];
};
const Timesheet = ({
  year,
  month,
  contract,
  currentTimesheet,
}: TimesheetProps) => {
  const { t } = useTranslation();

  const columnHelper = createColumnHelper<TimesheetDay>();

  const columns = [
    columnHelper.group({
      id: 'day',
      header: 'Day',
      columns: [
        columnHelper.accessor('dayOfMonth', {
          header: 'Nr',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('weekdayName', {
          header: 'Tag',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('targetTimeOfDay', {
          header: 'Soll',
          cell: (info) => info.getValue() || undefined,
        }),
        columnHelper.accessor('timeOfDay', {
          header: 'Ist',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('timeDiffOfDay', {
          header: 'Diff',
          cell: (info) => info.getValue(),
        }),
      ],
    }),
    columnHelper.group({
      id: 'rest',
      header: 'Info',
      columns: [
        columnHelper.accessor('publicHolidayName', {
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('eventsOfDay', {
          cell: (info) => {
            const eventsOfDay: EventsOfDay = info.getValue();
            const hasLeaves = eventsOfDay?.leaves > 0;
            return hasLeaves ? 'Abwesend' : undefined;
          },
        }),
      ],
    }),
  ];
  const contractBase: 'hours' | 'appointments' =
    contract?.appointmentsPerWeek && contract?.appointmentsPerWeek > 0
      ? 'appointments'
      : 'hours';

  const targetTimePerDay =
    ((contract && contract[`${contractBase}PerWeek`]) || 0) /
    ((contract && contract.workdaysPerWeek) || 0);
  const leaveWorthPerDay = targetTimePerDay;

  const currentMonth = dayjs().year(year).month(month);
  const monthName = currentMonth.format('MMM');
  const table = useReactTable({
    data: currentTimesheet,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <div className="header">
        <div className="timeframe">{`${year} / ${monthName}`}</div>
        <div className="contract">
          {t('employee.contract.label')}:{' '}
          {t('employee.contract.summary', {
            numberOfUnits: contract[`${contractBase}PerWeek`] || 0,
            contractBase: t(`employee.contract.${contractBase}`),
            workdaysPerWeek: contract.workdaysPerWeek,
          })}{' '}
          {t('employee.contract.leaveWorthDescription', {
            leaveWorthPerDay,
            contractBase: t(`employee.contract.${contractBase}`),
          })}
        </div>
      </div>
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: row.original.isWeekend
                    ? 'lightgray'
                    : row.original.publicHolidayName
                    ? 'lightskyblue'
                    : undefined,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Styles>
    </>
  );
};

export default Timesheet;
