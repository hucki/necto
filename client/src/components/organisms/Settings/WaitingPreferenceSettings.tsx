import { Button, Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoTrash } from 'react-icons/io5';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { IconButton } from '../../atoms/Buttons';
import { SettingsWrapper } from '../../atoms/Wrapper';
import { FormGroup, LabelledInput } from '../../Library';
import {
  useAllWaitingPreferences,
  useCreateWaitingPreference,
  useDeleteWaitingPreference,
} from '../../../hooks/settings';
import { WaitingPreference } from '../../../types/Settings';

const WaitingPreferenceSettings = () => {
  const emptyWaitingPreference = {
    key: '',
    label: '',
  };
  const { isLoading, waitingPreferences } = useAllWaitingPreferences();
  const { mutateAsync: createWaitingPreference } = useCreateWaitingPreference();
  const { mutateAsync: deleteWaitingPreference } = useDeleteWaitingPreference();
  const [newWaitingPreference, setNewWaitingPreference] = useState(() => ({
    ...emptyWaitingPreference,
  }));

  const handleSubmit = () => {
    if (
      waitingPreferences.findIndex(
        (wp) => wp.key === newWaitingPreference.key
      ) !== -1
    ) {
      return;
    }
    if (newWaitingPreference.key && newWaitingPreference.label) {
      createWaitingPreference({ wp: newWaitingPreference }).finally(() =>
        setNewWaitingPreference(() => ({ ...emptyWaitingPreference }))
      );
    }
  };

  const handleChange = (
    event: React.FormEvent<HTMLInputElement>,
    key: 'key' | 'label'
  ) => {
    event.preventDefault();
    const newWP = { ...newWaitingPreference };
    newWP[key] = event.currentTarget.value;
    setNewWaitingPreference(newWP);
  };

  const handleDelete = (key: WaitingPreference['key']) => {
    deleteWaitingPreference({ key });
  };

  const CurrentWaitingPreferences = () => {
    if (!waitingPreferences.length) return null;
    return (
      <List>
        {waitingPreferences.map((wp) => (
          <ListItem key={wp.key}>
            <ListIcon as={RiArrowDropRightLine} />
            <b>{wp.key}</b> | <span>{wp.label}</span>
            {wp._count.patients <= 0 && (
              <IconButton
                size="sm"
                icon={<IoTrash />}
                colorScheme="red"
                onClick={() => handleDelete(wp.key)}
                aria-label="delete waiting preference"
              />
            )}
          </ListItem>
        ))}
      </List>
    );
  };
  return (
    <>
      <SettingsWrapper>
        <Heading as="h3" size="md" mb="2" mt="5">
          Waiting Preferences
        </Heading>
        {isLoading ? (
          'pending'
        ) : waitingPreferences.length ? (
          <CurrentWaitingPreferences />
        ) : (
          'no waitingPreferences'
        )}
        <Heading as="h3" size="md" mb="2" mt="5">
          new waiting preference
        </Heading>
        <LabelledInput
          label="key"
          id="waitingPreferenceKey"
          name="waitingPreferenceKey"
          value={newWaitingPreference.key}
          onChangeHandler={(e) => handleChange(e, 'key')}
          type="text"
        />
        <LabelledInput
          label="Label"
          id="waitingPreferenceLabel"
          name="waitingPreferenceLabel"
          value={newWaitingPreference.label}
          onChangeHandler={(e) => handleChange(e, 'label')}
          type="text"
        />
        <FormGroup>
          <Button onClick={handleSubmit}>Save</Button>
        </FormGroup>
      </SettingsWrapper>
    </>
  );
};

export default WaitingPreferenceSettings;
