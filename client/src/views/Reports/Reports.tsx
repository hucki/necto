import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IoPeople } from 'react-icons/io5';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import { TabPanel } from '../../components/Library';
import EmployeeDashboard from '../../components/organisms/Dashboard/EmployeeDashboard';
import EmployeeReport from '../../components/organisms/List/EmployeeReport';
import { useAllEmployeesWithWeeksEvents } from '../../hooks/employees';
import { UserDateContext } from '../../providers/UserDate';
import SingleView from '../../components/organisms/Employee/SingleView';
import SingleYearView from '../../components/organisms/Employee/SingleYearView';

const Reports = () => {
  const { t } = useTranslation();
  const { currentDate } = useContext(UserDateContext);
  const { data, isLoading } = useAllEmployeesWithWeeksEvents(
    currentDate.year(),
    currentDate.isoWeek()
  );
  const dateRangeLabel =
    currentDate.startOf('week').format('DD.MM.') +
    ' - ' +
    currentDate.endOf('week').format('DD.MM.YY');

  const tabData = [
    {
      allowedRoles: ['admin'],
      name: 'singleView',
      label: (
        <>
          <IoPeople /> {t('menu.singleView')}
        </>
      ),
      content: (
        <>
          <SingleView />
        </>
      ),
    },
    {
      allowedRoles: ['admin'],
      name: 'singleYearView',
      label: (
        <>
          <IoPeople /> {t('menu.singleYearView')}
        </>
      ),
      content: (
        <>
          <SingleYearView />
        </>
      ),
    },
    {
      allowedRoles: ['admin'],
      name: 'weekReport',
      label: (
        <>
          <IoPeople /> {t('menu.weekReport')}
        </>
      ),
      content: (
        <>
          current week: {dateRangeLabel + ' (KW ' + currentDate.isoWeek() + ')'}
          {(!data || isLoading) && <FullPageSpinner />}
          {data && (
            <EmployeeReport
              employees={data}
              dateRangeLabel={dateRangeLabel}
              dateRange={{
                start: currentDate.startOf('week'),
                end: currentDate.endOf('week'),
              }}
            />
          )}
        </>
      ),
    },
    {
      allowedRoles: ['admin'],
      name: 'teamSettings',
      label: (
        <>
          <IoPeople /> {t('menu.teamSettings')}
        </>
      ),
      content: (
        <>
          current week: {dateRangeLabel + ' (KW ' + currentDate.isoWeek() + ')'}
          {(!data || isLoading) && <FullPageSpinner />}
          {data && <EmployeeDashboard employees={data} />}
        </>
      ),
    },
  ];
  return (
    <>
      <Tabs isLazy>
        <TabList>
          {tabData.map((tab, index) => {
            return <Tab key={index}>{tab.label}</Tab>;
          })}
        </TabList>
        <TabPanels>
          {tabData.map((tab, index) => {
            return <TabPanel key={index}>{tab.content}</TabPanel>;
          })}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Reports;
