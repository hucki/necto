import styled from '@emotion/styled/macro';
import dayjs from 'dayjs';
import React from 'react';
import { Patient } from '../../../types/Patient';

const MetaDataWrapper = styled.div({
  padding: '0.2rem',
  fontSize: 'small',
});

export const PersonMetaData = ({
  createdAt,
  updatedAt,
}: Pick<Patient, 'createdAt' | 'updatedAt'>) => {
  return (
    <MetaDataWrapper>
      <div className="created-date">
        angelegt: {dayjs(createdAt).format('l')}
      </div>
      <div className="updated-date">
        aktualisiert: {dayjs(updatedAt).format('l')}
      </div>
    </MetaDataWrapper>
  );
};
