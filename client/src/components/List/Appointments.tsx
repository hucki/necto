import { ChakraProps, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { Event } from '../../types/Event';

interface AppointmentListProps {
  events: Event[]
}
export const AppointmentList = ({events}: AppointmentListProps) => {
  const cancelStyle: ChakraProps['css'] = {
    textDecoration: 'line-through',
    color: 'gray'
  };
  const {t} = useTranslation();
  const EventRows = (): JSX.Element[] => events.map(event =>
    <Tr key={event.uuid} css={event.isCancelled ? cancelStyle : undefined}>
      <Td>{dayjs(event.startTime).format('llll')}</Td>
      <Td>{event.employee?.alias}</Td>
      <Td>
        <Icon
          as={
            event.isDiagnostic
              ? RiCheckLine
              : RiCheckboxBlankLine
          }
          w={5}
          h={5}
          color={event.isDiagnostic ? 'indigo' : 'gray.400'}
        />
      </Td>
    </Tr>
  );
  return <>
    <Table variant="striped" size="sm" colorScheme="blue">
      <Thead>
        <Tr>
          <Th>{t('label.date')}</Th>
          <Th>{t('label.therapist')}</Th>
          <Th>{t('label.diagnostic')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {EventRows()}
      </Tbody>
    </Table>
  </>;
};