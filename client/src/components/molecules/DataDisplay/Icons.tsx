import { Icon } from '@chakra-ui/react';
import React from 'react';
import {
  FaCommentMedical,
  FaExclamation,
  FaHouseUser,
  FaLink,
  FaPlane,
  FaPlaneDeparture,
} from 'react-icons/fa';

interface EventIconProps {
  type:
    | 'homeVisit'
    | 'diagnostic'
    | 'noContract'
    | 'recurring'
    | 'vacationFirstDay'
    | 'vacation'
    | 'sick';
  size: 's' | 'm' | 'l';
}

const sizes = {
  s: '0.75rem',
  m: '1rem',
  l: '1.5rem',
};

const icons = {
  vacationFirstDay: FaPlaneDeparture,
  vacation: FaPlane,
  sick: FaCommentMedical,
  homeVisit: FaHouseUser,
  diagnostic: FaCommentMedical,
  noContract: FaExclamation,
  recurring: FaLink,
};

const colors = {
  vacationFirstDay: 'green',
  vacation: 'green',
  sick: 'orangered',
  homeVisit: 'steelblue',
  diagnostic: 'seagreen',
  noContract: 'tomato',
  recurring: 'blueviolet',
};

export const EventIcon = ({ type, size }: EventIconProps) => {
  return (
    <Icon
      as={icons[type]}
      color={colors[type]}
      style={{
        width: sizes[size],
        height: sizes[size],
      }}
    />
  );
};
