import React, { useEffect, useState } from 'react';
import { Button, Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import TeamSettings from '../TeamSettings/TeamSettings';
import EmployeeSettings from '../EmployeeSettings/EmployeeSettings';
import {
  IoCalendarNumberOutline,
  IoConstructOutline,
  IoPeople,
  IoPeopleCircleOutline,
  IoPersonCircleOutline,
} from 'react-icons/io5';
import UserProfile from '../../components/organisms/UserProfile/UserProfile';
import { useTranslation } from 'react-i18next';
import EventSettings from '../EventSettings/EventSettings';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { UserSettings } from '../UserSettings/UserSettings';
import { useViewport } from '../../hooks/useViewport';
import { TabPanel } from '../../components/Library';
import { useAllPatients } from '../../hooks/patient';
import { useCreateAddpayFreedom } from '../../hooks/addpay';

const Migrations = (): JSX.Element => {
  const { patients } = useAllPatients();
  const { mutateAsync: createAddpayFreedom, isSuccess } =
    useCreateAddpayFreedom();
  const [message, setMessage] = useState('');
  interface ConverterProps {
    targetYear: number;
  }
  useEffect(() => {
    setMessage(
      'no of Patients: ' + patients.length + ', updateSuccess: ' + isSuccess
    );
  }, [patients, isSuccess]);
  const convertIsAddPayFreedToAddpayFreedom = ({
    targetYear,
  }: ConverterProps) => {
    if (!patients) return;
    console.log('we have patients');
    for (let i = 0; i < patients.length; i++) {
      console.log('patient ', i);
      if (patients[i].isAddpayFreed) {
        console.log('patient ', i, patients[i].isAddpayFreed);
        if (
          !patients[i].addpayFreedom?.find(
            (freedom) =>
              new Date(freedom.freedUntil).getFullYear() === targetYear
          )
        ) {
          const newAddpayFreedom = {
            pid: patients[i].uuid || '',
            freedFrom: new Date(`01-01-${targetYear}`),
            freedUntil: new Date(`12-31-${targetYear}`),
          };
          if (newAddpayFreedom.pid.length) {
            createAddpayFreedom({
              addpayFreedom: newAddpayFreedom,
            });
          }
        }
      }
    }
  };
  return (
    <>
      <Button
        onClick={() =>
          convertIsAddPayFreedToAddpayFreedom({ targetYear: 2022 })
        }
      >
        convert isAddPayFreed to 2022
      </Button>
      <pre>{message}</pre>
    </>
  );
};

type AllowedRoles = ('employee' | 'planner' | 'admin' | 'user')[];

const Settings = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const tabData = [
    {
      allowedRoles: ['admin', 'planner', 'employee'],
      name: 'teamSettings',
      label: (
        <>
          <IoPeople /> {t('menu.teamSettings')}
        </>
      ),
      content: <TeamSettings />,
    },
    {
      allowedRoles: ['admin', 'planner'],
      name: 'employeeSettings',
      label: (
        <>
          <IoPeopleCircleOutline />
          {t('menu.employeeSettings')}
        </>
      ),
      content: <EmployeeSettings />,
    },
    {
      allowedRoles: ['admin'],
      name: 'userSettings',
      label: (
        <>
          <IoPersonCircleOutline />
          {t('menu.userSettings')}
        </>
      ),
      content: <UserSettings />,
    },
    {
      allowedRoles: ['admin', 'planner'],
      name: 'eventSettings',
      label: (
        <>
          <IoCalendarNumberOutline />
          {t('menu.eventSettings')}
        </>
      ),
      content: <EventSettings />,
    },
    {
      allowedRoles: ['admin', 'planner', 'employee', 'user'],
      name: 'userProfile',
      label: (
        <>
          <IoConstructOutline />
          {t('menu.profile')}
        </>
      ),
      content: <UserProfile id={user?.uuid || ''} />,
    },
    {
      allowedRoles: ['admin'],
      name: 'migrations',
      label: <>❌ migrations ❌</>,
      content: <Migrations />,
    },
  ];

  const hasSufficientRole = (allowedRoles: AllowedRoles) => {
    if (user?.isEmployee && Boolean(allowedRoles.find((r) => r === 'employee')))
      return true;
    if (user?.isPlanner && Boolean(allowedRoles.find((r) => r === 'planner')))
      return true;
    if (user?.isAdmin && Boolean(allowedRoles.find((r) => r === 'admin')))
      return true;
    if (allowedRoles.find((r) => r === 'user')) return true;
    if (user?.isAdmin) return true;
    return false;
  };

  return (
    <Tabs isLazy>
      <TabList>
        {tabData.map((tab, index) => {
          if (isMobile) {
            if (tab.name === 'userProfile')
              return <Tab key={index}>{tab.label}</Tab>;
          } else if (hasSufficientRole(tab.allowedRoles as AllowedRoles)) {
            return <Tab key={index}>{tab.label}</Tab>;
          }
        })}
      </TabList>
      <TabPanels>
        {tabData.map((tab, index) => {
          if (isMobile) {
            if (tab.name === 'userProfile')
              return <TabPanel key={index}>{tab.content}</TabPanel>;
          } else if (hasSufficientRole(tab.allowedRoles as AllowedRoles)) {
            return <TabPanel key={index}>{tab.content}</TabPanel>;
          }
        })}
      </TabPanels>
    </Tabs>
  );
};

export default Settings;
