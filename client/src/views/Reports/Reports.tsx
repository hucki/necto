import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IoPeople } from 'react-icons/io5';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import { TabPanel } from '../../components/Library';
import EmployeeDashboard from '../../components/organisms/Dashboard/EmployeeDashboard';
import { useAllEmployeesWithWeeksEvents } from '../../hooks/employees';
import { UserDateContext } from '../../providers/UserDate';

const Reports = () => {
  const { t } = useTranslation();
  const { currentDate } = useContext(UserDateContext);
  const { data, isLoading } = useAllEmployeesWithWeeksEvents(
    currentDate.year(),
    currentDate.week()
  );
  const dateRange =
    currentDate.startOf('week').format('DD.MM.') +
    ' - ' +
    currentDate.endOf('week').format('DD.MM.YY');

  const tabData = [
    {
      allowedRoles: ['admin', 'planner', 'employee'],
      name: 'teamSettings',
      label: (
        <>
          <IoPeople /> {t('menu.teamSettings')}
        </>
      ),
      content: (
        <>
          current week: {dateRange + ' (KW ' + currentDate.week() + ')'}
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
