/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
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

const Settings = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabList>
        <Tab>
          <RiUserSettingsFill />
          {t('menu.teamSettings')}
        </Tab>
        <Tab>
          <RiUserSettingsLine />
          {t('menu.employeeSettings')}
        </Tab>
        <Tab>
          <RiShieldUserLine />
          {t('menu.userSettings')}
        </Tab>
        <Tab>
          <RiCalendarEventLine />
          {t('menu.eventSettings')}
        </Tab>
        <Tab>
          <RiProfileLine />
          {t('menu.profile')}
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <TeamSettings />
        </TabPanel>
        <TabPanel>
          <EmployeeSettings />
        </TabPanel>
        <TabPanel maxW="500px">
          <UserSettings />
        </TabPanel>
        <TabPanel maxW="500px">
          <EventSettings />
        </TabPanel>
        {user && (
          <TabPanel>
            <UserProfile id={user.uuid}/>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default Settings;
