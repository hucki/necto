import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import {
  useAddpayFreedomOfPatient,
  useCreateAddpayFreedom,
  useDeleteAddpayFreedom,
} from '../../../hooks/addpay';
import { AddpayFreedom } from '../../../types/Patient';

interface TagWrapperProps {
  numOfTags: number;
}
const TagWrapper = styled.div((p: TagWrapperProps) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${p.numOfTags}, auto)`,
  gridColumnGap: '0.5rem',
}));
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
  const tags = addpayState.map((yearsState) => {
    const isActive = yearsState.addpayFreed;
    const clickHandler =
      !isActive && onAddHandler
        ? () => onAddHandler(yearsState.year)
        : isActive && onRemoveHandler
        ? () => onRemoveHandler(yearsState.year)
        : undefined;
    return (
      <Tag
        as={isInteractive ? 'button' : undefined}
        key={yearsState.year}
        size={size}
        variant={isActive ? 'solid' : 'subtle'}
        colorScheme={isActive ? 'green' : 'gray'}
        onClick={isInteractive ? clickHandler : undefined}
        style={{ cursor: isInteractive ? 'pointer' : undefined }}
      >
        {isInteractive && clickHandler && !yearsState.disabled && (
          <TagLeftIcon as={!isActive ? FaPlus : FaMinus} />
        )}
        <TagLabel style={{ textAlign: 'center' }}>{yearsState.year}</TagLabel>
      </Tag>
    );
  });
  return <TagWrapper numOfTags={tags.length}>{tags}</TagWrapper>;
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
      year: year.toString(),
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
