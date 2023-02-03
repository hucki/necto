import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Employee } from '../../../types/Employee';
import { TableRow } from '../../Library/Table';
import EventReport from '../../molecules/DataDisplay/EventReport';

type ReportEmployee = Pick<
  Employee,
  'firstName' | 'lastName' | 'alias' | 'contract' | 'events'
>;
interface EmployeeReportProps {
  employees: ReportEmployee[];
  dateRange: string;
}
/**
 * Report for Event states of Employees
 * see Example {@link https://tanstack.com/table/v8/docs/examples/react/basic}
 * @param employees
 * @returns JSX.Element
 */
const EmployeeReport = ({ employees, dateRange }: EmployeeReportProps) => {
  const { t } = useTranslation();
  const columnHelper =
    createColumnHelper<
      Pick<Employee, 'firstName' | 'lastName' | 'alias' | 'contract' | 'events'>
    >();
  const columns = [
    columnHelper.accessor('firstName', {
      header: () => <span>{t('label.firstName')}</span>,
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => <span>{t('label.lastName')}</span>,
      cell: (info) => <i>{info.getValue()}</i>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('alias', {
      header: () => t('label.alias'),
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    // columnHelper.accessor('contract', {
    //   header: () => 'hours per week',
    //   cell: (info) => <span>{info.getValue()[0].hoursPerWeek}</span>,
    //   footer: (info) => info.column.id,
    // }),
    columnHelper.accessor('events', {
      header: () => 'done / cancelled',
      cell: (info) => {
        const events = info.getValue();
        return (
          events && (
            <EventReport
              useStatGroup={true}
              events={events}
              dateRange={dateRange}
            />
          )
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
          {/* <thead>
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
          </thead> */}
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
