/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import TeamSettings from '../TeamSettings/TeamSettings';
import EmployeeSettings from '../EmployeeSettings/EmployeeSettings';
import {
  RiProfileLine,
  RiUserSettingsFill,
  RiUserSettingsLine,
} from 'react-icons/ri';
import UserProfile from '../../components/UserProfile/UserProfile';
import { useTranslation } from 'react-i18next';

interface SettingsProps {
  a0Id: string;
}

const Settings = ({ a0Id }: SettingsProps): JSX.Element => {
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
        <TabPanel>
          <UserProfile a0Id={a0Id} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Settings;
