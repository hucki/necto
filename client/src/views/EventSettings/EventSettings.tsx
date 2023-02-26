import { Heading } from '@chakra-ui/react';
import React from 'react';
import { SettingsGrid } from '../../components/atoms/Wrapper';
import CancellationReasonSettings from '../../components/organisms/Settings/CancellationReasonSettings';
import WaitingPreferenceSettings from '../../components/organisms/Settings/WaitingPreferenceSettings';

const EventSettings = () => {
  return (
    <>
      <Heading as="h2" size="lg">
        Event Settings
      </Heading>
      <SettingsGrid>
        <CancellationReasonSettings />
        <WaitingPreferenceSettings />
      </SettingsGrid>
    </>
  );
};

export default EventSettings;
