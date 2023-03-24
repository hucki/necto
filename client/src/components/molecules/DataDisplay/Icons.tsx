import { Icon } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import {
  FaBaby,
  FaCommentMedical,
  FaExclamation,
  FaHouseUser,
  FaLink,
  FaPlane,
  FaPlaneDeparture,
  FaQuestion,
  FaSchool,
  FaUmbrellaBeach,
} from 'react-icons/fa';
import { LeaveType } from '../../../types/Event';

interface EventIconProps {
  type:
    | LeaveType
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
type EventIcons = {
  // eslint-disable-next-line no-unused-vars
  [key in EventIconProps['type']]: IconType;
};
const icons: EventIcons = {
  vacationFirstDay: FaPlaneDeparture,
  vacation: FaPlane,
  paidVacation: FaUmbrellaBeach,
  unpaidLeave: FaQuestion,
  parentalLeave: FaBaby,
  training: FaSchool,
  special: FaSchool,
  sick: FaCommentMedical,
  sickChild: FaCommentMedical,
  homeVisit: FaHouseUser,
  diagnostic: FaCommentMedical,
  noContract: FaExclamation,
  recurring: FaLink,
};

const colors = {
  vacationFirstDay: 'green',
  vacation: 'green',
  paidVacation: 'green',
  unpaidLeave: 'blueviolet',
  parentalLeave: 'blueviolet',
  sick: 'orangered',
  sickChild: 'orangered',
  homeVisit: 'steelblue',
  training: 'steelblue',
  special: 'steelblue',
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
