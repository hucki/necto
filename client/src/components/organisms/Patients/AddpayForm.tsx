import { Tag, TagCloseButton, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import {
  useAddpayFreedomOfPatient,
  useCreateAddpayFreedom,
  useDeleteAddpayFreedom,
} from '../../../hooks/addpay';
import { AddpayFreedom } from '../../../types/Patient';

const TagWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'auto auto auto',
  gridColumnGap: '0.5rem',
});
interface AddpayFormProps {
  patientId: string;
  isReadOnly: boolean;
  size?: 'lg' | 'sm' | 'md';
}
interface AddpayState {
  year: number;
  disabled: boolean;
  addpayFreed: boolean;
}

interface GetAddpayForTagsProps {
  currentYear: number;
  addpayFreedom: AddpayFreedom[];
  onlyCurrentYear?: boolean;
}
export const getAddpayForTags = ({
  currentYear,
  addpayFreedom,
  onlyCurrentYear = false,
}: GetAddpayForTagsProps) => {
  const years = onlyCurrentYear
    ? [currentYear]
    : [currentYear, currentYear + 1, currentYear - 1];
  return years.map((year) => ({
    year: year,
    disabled: Boolean(year === currentYear - 1),
    addpayFreed: Boolean(
      addpayFreedom.find(
        (item) => new Date(item.freedUntil).getFullYear() === year
      )
    ),
  }));
};

interface AddpayTagsProps {
  addpayState: AddpayState[];
  isInteractive: boolean;
  size?: 'lg' | 'sm' | 'md';
  // eslint-disable-next-line no-unused-vars
  onAddHandler?: (year: number) => void;
  // eslint-disable-next-line no-unused-vars
  onRemoveHandler?: (year: number) => void;
}

export const AddpayTags = ({
  addpayState,
  isInteractive,
  onAddHandler,
  onRemoveHandler,
  size = 'md',
}: AddpayTagsProps) => {
  const tags = addpayState.map((yearsState) => (
    <Tag
      key={yearsState.year}
      size={size}
      variant={yearsState.addpayFreed ? 'solid' : 'subtle'}
      colorScheme={yearsState.addpayFreed ? 'green' : 'gray'}
    >
      {isInteractive &&
        onAddHandler &&
        !yearsState.addpayFreed &&
        !yearsState.disabled && (
          <TagLeftIcon
            as={FaPlus}
            onClick={() => onAddHandler(yearsState.year)}
            style={{ cursor: 'pointer' }}
          />
        )}
      <TagLabel style={{ textAlign: 'center' }}>{yearsState.year}</TagLabel>

      {isInteractive &&
        onRemoveHandler &&
        yearsState.addpayFreed &&
        !yearsState.disabled && (
          <TagCloseButton onClick={() => onRemoveHandler(yearsState.year)} />
        )}
    </Tag>
  ));
  return <TagWrapper>{tags}</TagWrapper>;
};

export const AddpayForm = ({
  patientId,
  isReadOnly = false,
  size = 'lg',
}: AddpayFormProps) => {
  const currentYear = new Date().getFullYear();
  const defaultAddpayState = [
    {
      year: currentYear,
      disabled: false,
      addpayFreed: false,
    },
    {
      year: currentYear + 1,
      disabled: false,
      addpayFreed: false,
    },
    {
      year: currentYear - 1,
      disabled: true,
      addpayFreed: false,
    },
  ];

  const [addpayState, setAddpayState] = useState(() => defaultAddpayState);
  const { addpayFreedom } = useAddpayFreedomOfPatient(patientId);
  const { mutateAsync: createAddpayFreedom } = useCreateAddpayFreedom();
  const { mutateAsync: deleteAddpayFreedom } = useDeleteAddpayFreedom();

  useEffect(() => {
    const newState = getAddpayForTags({ addpayFreedom, currentYear });
    setAddpayState(newState);
  }, [addpayFreedom]);

  const handleCreateAddpayFreedom = (year: number) => {
    const newAddpayFreedom = {
      pid: patientId,
      freedFrom: new Date(`01-01-${year}`),
      freedUntil: new Date(`12-31-${year}`),
    };
    createAddpayFreedom({
      addpayFreedom: newAddpayFreedom,
    });
  };
  const handleRemoveAddpayFreedom = (year: number) => {
    const toRemove = addpayFreedom.filter(
      (freedom) => new Date(freedom.freedUntil).getFullYear() === year
    )[0].uuid;

    if (toRemove) {
      deleteAddpayFreedom({
        uuid: toRemove,
      });
    }
  };

  return (
    <>
      <AddpayTags
        size={size}
        isInteractive={!isReadOnly}
        addpayState={addpayState}
        onAddHandler={handleCreateAddpayFreedom}
        onRemoveHandler={handleRemoveAddpayFreedom}
      />
    </>
  );
};
