import React from 'react';
import { Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';

interface StatTileProps {
  label: string;
  stats: {
    total: number;
    done?: number;
  };
  helpText?: string;
}

const StatTile = ({ label, stats, helpText }: StatTileProps) => {
  const { done, total } = stats;
  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{`${
        typeof done === 'number' ? done + ' / ' : ''
      }${total}`}</StatNumber>
      {helpText && <StatHelpText>{helpText}</StatHelpText>}
    </Stat>
  );
};

export default StatTile;
