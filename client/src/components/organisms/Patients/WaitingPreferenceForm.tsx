import { Tag, TagCloseButton, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import {
  useConnectWaitingPreference,
  useDisconnectWaitingPreference,
} from '../../../hooks/patient';
import { useAllWaitingPreferences } from '../../../hooks/settings';
import { useViewport } from '../../../hooks/useViewport';
import { Patient } from '../../../types/Patient';

export const WaitingPreferenceTagWrapper = styled.div(
  ({
    isMobile = true,
    isReadOnly = true,
  }: {
    isMobile: boolean;
    isReadOnly: boolean;
  }) => ({
    display: 'flex',
    flexDirection: isMobile && !isReadOnly ? 'column' : 'row',
    gap: '0.5rem',
    justifyContent: isMobile ? 'space-evenly' : 'flex-start',
    marginBottom: '1.5rem',
  })
);

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
    <WaitingPreferenceTagWrapper isMobile={isMobile} isReadOnly={isReadOnly}>
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
              key={wp.key}
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
    </WaitingPreferenceTagWrapper>
  );
};
