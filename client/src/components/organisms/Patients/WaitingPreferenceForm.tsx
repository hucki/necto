import { Tag, TagCloseButton, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import {
  useConnectWaitingPreference,
  useDisconnectWaitingPreference,
} from '../../../hooks/patient';
import { useAllWaitingPreferences } from '../../../hooks/settings';
import { useViewport } from '../../../hooks/useViewport';
import { Patient } from '../../../types/Patient';

export type WaitingPreferenceFormProps = {
  isReadOnly: boolean;
  patientId: Patient['uuid'];
};
export const WaitingPreferenceForm = ({
  isReadOnly,
  patientId,
}: WaitingPreferenceFormProps) => {
  const { isMobile } = useViewport();
  const { waitingPreferences } = useAllWaitingPreferences();
  const { mutateAsync: connectWaitingPreference } =
    useConnectWaitingPreference();
  const { mutateAsync: disconnectWaitingPreference } =
    useDisconnectWaitingPreference();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile && !isReadOnly ? 'column' : 'row',
        gap: '0.5rem',
        justifyContent: isMobile ? 'space-evenly' : 'flex-start',
        marginBottom: '1.5rem',
      }}
    >
      {waitingPreferences.map((wp) => {
        const hasWaitingPreference = wp.patients.find(
          (p) => p.uuid === patientId
        );

        return (
          <>
            <Tag
              size={isReadOnly ? 'md' : 'lg'}
              variant={hasWaitingPreference ? 'solid' : 'subtle'}
              colorScheme={hasWaitingPreference ? 'green' : 'gray'}
            >
              {!isReadOnly && !hasWaitingPreference && (
                <TagLeftIcon
                  as={FaPlus}
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    connectWaitingPreference({
                      patientId,
                      waitingPreferenceKey: wp.key,
                    })
                  }
                />
              )}
              <TagLabel>{wp.label}</TagLabel>
              {!isReadOnly && hasWaitingPreference && (
                <TagCloseButton
                  onClick={() =>
                    disconnectWaitingPreference({
                      patientId,
                      waitingPreferenceKey: wp.key,
                    })
                  }
                />
              )}
            </Tag>
          </>
        );
      })}
    </div>
  );
};
