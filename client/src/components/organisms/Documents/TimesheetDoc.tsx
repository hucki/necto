import React from 'react';
import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer';
import {
  LeaveStateEvaluated,
  TimesheetPerYear,
} from '../../../hooks/timesheet';
import { ContractSummaryDoc } from '../../molecules/DataDisplay/ContractSummary';
import { Contract } from '../../../types/Employee';
import { Leave } from '../../../types/Event';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { timesheetStyle } from './styles';

interface TimesheetYearDocProps {
  timesheet: TimesheetPerYear;
  year: string;
  name: string;
  contract: Contract;
}

export const TimesheetYearDoc = ({
  timesheet,
  year,
  name,
  contract,
}: TimesheetYearDocProps) => {
  type GetInterpretedValueProps = {
    value?: string | number;
  };
  const { t } = useTranslation();
  const getInterpretedValue = ({ value = '-' }: GetInterpretedValueProps) => {
    if (typeof value === 'string') return value;
    return value === 0 ? '-' : value.toFixed(2);
  };

  type ReducedLeaveState = {
    sums: {
      // eslint-disable-next-line no-unused-vars
      [key in Leave['leaveType']]: {
        sumOfDays: number;
        sumOfHours: number;
      };
    };
  };
  const reduceLeaveState = (leaveState: LeaveStateEvaluated[]) => {
    return leaveState.reduce(
      (prev, cur) => {
        prev.sums[cur.leaveType as Leave['leaveType']].sumOfHours +=
          cur.valueInHours;
        prev.sums[cur.leaveType as Leave['leaveType']].sumOfDays +=
          cur.valueInHours !== 0 ? 1 : 0;
        return prev;
      },
      {
        sums: {
          sick: { sumOfDays: 0, sumOfHours: 0 },
          sickChild: { sumOfDays: 0, sumOfHours: 0 },
          paidVacation: { sumOfDays: 0, sumOfHours: 0 },
          unpaidLeave: { sumOfDays: 0, sumOfHours: 0 },
          parentalLeave: { sumOfDays: 0, sumOfHours: 0 },
          training: { sumOfDays: 0, sumOfHours: 0 },
          special: { sumOfDays: 0, sumOfHours: 0 },
        },
      } as ReducedLeaveState
    );
  };
  const TimesheetTable = () => {
    // return <>no data</>;

    return (
      <View style={timesheetStyle.table}>
        <View style={timesheetStyle.thead}>
          <Text style={{ ...timesheetStyle.td, ...timesheetStyle.colMonth }}>
            Monat
          </Text>
          <Text style={{ ...timesheetStyle.td, ...timesheetStyle.colShould }}>
            Soll
          </Text>
          <Text style={{ ...timesheetStyle.td, ...timesheetStyle.colPlan }}>
            Plan
          </Text>
          <Text style={{ ...timesheetStyle.td, ...timesheetStyle.colIs }}>
            Ist
          </Text>
          <Text style={{ ...timesheetStyle.td, ...timesheetStyle.colDiff }}>
            Diff
          </Text>
          <Text style={{ ...timesheetStyle.td, ...timesheetStyle.colAbsence }}>
            Abwesenheiten
          </Text>
        </View>
        <View>
          {Object.keys(timesheet[year]).map((month) => {
            const monthLabel = dayjs().month(parseInt(month)).format('MMM');
            const sum = timesheet[year][parseInt(month)].timesheetSum;
            const sums =
              (sum && reduceLeaveState(sum.leaveStates).sums) || undefined;
            const absence =
              sums &&
              Object.keys(sums).map((leaveType) => {
                const days = sums[leaveType as Leave['leaveType']].sumOfDays;
                const hours = sums[leaveType as Leave['leaveType']].sumOfHours;
                if (!days) return null;
                return (
                  <Text key={leaveType}>
                    {t(`calendar.leave.type.${leaveType}`)}: {days} Tage (
                    {hours}h)
                  </Text>
                );
              });

            return (
              sum && (
                <View
                  key={month}
                  style={{
                    ...timesheetStyle.tr,
                    backgroundColor: month === '99' ? '#3333' : undefined,
                    fontWeight: month === '99' ? 'extrabold' : undefined,
                  }}
                >
                  <Text
                    style={{ ...timesheetStyle.td, ...timesheetStyle.colMonth }}
                  >
                    {month === '99'
                      ? 'Summe'
                      : `${(parseInt(month) + 1)
                          .toString()
                          .padStart(2, '0')} - ${monthLabel}`}
                  </Text>
                  <Text
                    style={{
                      ...timesheetStyle.td,
                      ...timesheetStyle.colShould,
                    }}
                  >
                    {getInterpretedValue({
                      value: sum.targetTimeOfDay,
                    })}
                  </Text>
                  <Text
                    style={{ ...timesheetStyle.td, ...timesheetStyle.colPlan }}
                  >
                    {getInterpretedValue({
                      value: sum.plannedTimeOfDay,
                    })}
                  </Text>
                  <Text
                    style={{ ...timesheetStyle.td, ...timesheetStyle.colIs }}
                  >
                    {getInterpretedValue({ value: sum.timeOfDay })}
                  </Text>
                  <Text
                    style={{
                      ...timesheetStyle.td,
                      ...timesheetStyle.colDiff,
                      color: sum.timeDiffOfDay < 0 ? 'red' : undefined,
                    }}
                  >
                    {getInterpretedValue({ value: sum.timeDiffOfDay })}
                  </Text>
                  <View
                    style={{
                      ...timesheetStyle.td,
                      ...timesheetStyle.colAbsence,
                    }}
                  >
                    <View style={{ flexDirection: 'column' }}>{absence}</View>
                  </View>
                </View>
              )
            );
          })}
        </View>
      </View>
    );
  };
  const TimesheetDocument = () => (
    <Document>
      <Page size="A4" style={timesheetStyle.page}>
        <View style={{ ...timesheetStyle.heading }}>
          <Text>
            Zeitkonto {year} - {name}
          </Text>
        </View>
        <View style={{ ...timesheetStyle.section }}>
          <Text>
            <ContractSummaryDoc contract={contract} />
          </Text>
        </View>
        <View style={{ ...timesheetStyle.section }}>
          <TimesheetTable />
        </View>
      </Page>
    </Document>
  );
  return (
    <PDFViewer width="100%" height="500px">
      <TimesheetDocument />
    </PDFViewer>
  );
};
