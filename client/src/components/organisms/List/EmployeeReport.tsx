import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { Employee } from '../../../types/Employee';
import { TableRow } from '../../Library/Table';
import EventReport from '../../molecules/DataDisplay/EventReport';

type ReportEmployee = Pick<
  Employee,
  'firstName' | 'lastName' | 'alias' | 'contract' | 'events'
>;
interface EmployeeReportProps {
  employees: ReportEmployee[];
  dateRangeLabel: string;
  dateRange: {
    start: Dayjs;
    end: Dayjs;
  };
}
/**
 * Report for Event states of Employees
 * see Example {@link https://tanstack.com/table/v8/docs/examples/react/basic}
 * @param employees
 * @returns JSX.Element
 */
const EmployeeReport = ({
  employees,
  dateRangeLabel,
  dateRange,
}: EmployeeReportProps) => {
  const numberOfDays = dateRange.end.diff(dateRange.start, 'days');
  const days = new Array(numberOfDays + 1)
    .fill(null)
    .map((_, index) => dateRange.start.add(index, 'day'));
  console.table(days);
  const columnHelper =
    createColumnHelper<
      Pick<Employee, 'firstName' | 'lastName' | 'alias' | 'contract' | 'events'>
    >();

  const columns = [
    // Accessor Column
    columnHelper.accessor('firstName', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    // Accessor Column
    columnHelper.accessor((row) => row.lastName, {
      header: '',
      id: 'lastName',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('alias', {
      header: '',
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('events', {
      header: () => {
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
            }}
          >
            {days.map((day) => (
              <div
                style={{
                  gridColumnStart: dayjs(day).day(),
                  border: '1px solid #333',
                }}
              >
                {day.format('ddd')}
              </div>
            ))}
          </div>
        );
      },
      cell: (info) => {
        const events = info.getValue();
        if (!events) return null;
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
            }}
          >
            {days.map((day) => (
              <div
                style={{
                  gridColumnStart: dayjs(day).day(),
                  border: '1px solid #333',
                }}
              >
                <EventReport
                  key={day.format('YYYY-MM-DD')}
                  useStatGroup={false}
                  events={events.filter(
                    (event) => dayjs(event.startTime).day() === day.day()
                  )}
                  dateRangeLabel={dateRangeLabel}
                />
              </div>
            ))}
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
  ];
  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <div className="report-wrapper">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      textAlign:
                        typeof cell.getValue() === 'number'
                          ? 'center'
                          : undefined,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeReport;
