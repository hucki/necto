import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
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
import { AuthContext } from '../../providers/Auth';
import { UserSettings } from '../UserSettings/UserSettings';

type AllowedRoles = ('employee'|'planner'|'admin'|'user')[]

const Settings = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const tabData = [
    {
      allowedRoles: ['admin', 'planner', 'employee'],
      label: <><RiUserSettingsFill /> {t('menu.teamSettings')}</>,
      content: <TeamSettings />
    },
    {
      allowedRoles: ['admin', 'planner'],
      label: <><RiUserSettingsLine />{t('menu.employeeSettings')}</>,
      content: <EmployeeSettings />
    },
    {
      allowedRoles: ['admin'],
      label: <><RiShieldUserLine />{t('menu.userSettings')}</>,
      content: <UserSettings />
    },
    {
      allowedRoles: ['admin', 'planner'],
      label: <><RiCalendarEventLine />{t('menu.eventSettings')}</>,
      content: <EventSettings />
    },
    {
      allowedRoles: ['admin', 'planner','employee','user'],
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
    <Tabs>
      <TabList>
        {tabData.map((tab, index) => {
          if (hasSufficientRole(tab.allowedRoles as AllowedRoles))
            return (
              <Tab key={index}>{tab.label}</Tab>
            );})
        }
      </TabList>
      <TabPanels>
        {tabData.map((tab, index) => {
          if (hasSufficientRole(tab.allowedRoles as AllowedRoles))
            return (
              <TabPanel key={index}>{tab.content}</TabPanel>
            );
        }
        )}
      </TabPanels>
    </Tabs>
  );
};

export default Settings;
