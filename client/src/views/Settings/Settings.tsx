import React from 'react';
import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import TeamSettings from '../TeamSettings/TeamSettings';
import EmployeeSettings from '../EmployeeSettings/EmployeeSettings';
import {
  RiCalendarEventLine,
  RiProfileLine,
  RiShieldUserLine,
  RiUserSettingsFill,
  RiUserSettingsLine,
} from 'react-icons/ri';
import UserProfile from '../../components/UserProfile/UserProfile';
import { useTranslation } from 'react-i18next';
import EventSettings from '../EventSettings/EventSettings';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { UserSettings } from '../UserSettings/UserSettings';
import { useViewport } from '../../hooks/useViewport';
import { TabPanel } from '../../components/Library';

type AllowedRoles = ('employee'|'planner'|'admin'|'user')[]

const Settings = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const tabData = [
    {
      allowedRoles: ['admin', 'planner', 'employee'],
      name: 'teamSettings',
      label: <><RiUserSettingsFill /> {t('menu.teamSettings')}</>,
      content: <TeamSettings />
    },
    {
      allowedRoles: ['admin', 'planner'],
      name: 'employeeSettings',
      label: <><RiUserSettingsLine />{t('menu.employeeSettings')}</>,
      content: <EmployeeSettings />
    },
    {
      allowedRoles: ['admin'],
      name: 'userSettings',
      label: <><RiShieldUserLine />{t('menu.userSettings')}</>,
      content: <UserSettings />
    },
    {
      allowedRoles: ['admin', 'planner'],
      name: 'eventSettings',
      label: <><RiCalendarEventLine />{t('menu.eventSettings')}</>,
      content: <EventSettings />
    },
    {
      allowedRoles: ['admin', 'planner','employee','user'],
      name: 'userProfile',
      label: <><RiProfileLine />{t('menu.profile')}</>,
      content: <UserProfile id={user?.uuid || ''}/>
    },
  ];

  const hasSufficientRole = (allowedRoles: AllowedRoles) => {
    if (user?.isEmployee && Boolean(allowedRoles.find(r => r === 'employee'))) return true;
    if (user?.isPlanner && Boolean(allowedRoles.find(r => r === 'planner'))) return true;
    if (user?.isAdmin && Boolean(allowedRoles.find(r => r === 'admin'))) return true;
    if (allowedRoles.find(r => r === 'user')) return true;
    if (user?.isAdmin) return true;
    return false;
  };

  return (
    <Tabs isLazy>
      <TabList>
        {tabData.map((tab, index) => {
          if (isMobile) {
            if (tab.name === 'userProfile') return (
              <Tab key={index}>{tab.label}</Tab>
            );
          } else if (hasSufficientRole(tab.allowedRoles as AllowedRoles)) {
            return (
              <Tab key={index}>{tab.label}</Tab>
            );
          }
        })
        }
      </TabList>
      <TabPanels>
        {tabData.map((tab, index) => {
          if (isMobile) {
            if (tab.name === 'userProfile') return (
              <TabPanel key={index}>{tab.content}</TabPanel>
            );
          } else if (hasSufficientRole(tab.allowedRoles as AllowedRoles)) {
            return (
              <TabPanel key={index}>{tab.content}</TabPanel>
            );
          }
        }
        )}
      </TabPanels>
    </Tabs>
  );
};

export default Settings;
