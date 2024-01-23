import {
  Button,
  ChakraProps,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { Event } from '../../../types/Event';
import { IconButton } from '../../atoms/Buttons';
import { usePatientEvents } from '../../../hooks/events';

interface EventListProps {
  patientId: string;
}
export const EventList = ({ patientId }: EventListProps) => {
  const { patientEvents: events } = usePatientEvents(patientId);

  const cancelStyle: ChakraProps['css'] = {
    textDecoration: 'line-through',
    color: 'gray',
  };

  const { t } = useTranslation();

  const sortedEvents = events
    // sort date asc
    .sort((a: Event, b: Event) =>
      dayjs(a.startTime).isAfter(dayjs(b.startTime)) ? -1 : 1
    );

  // pagination controls
  const rowsPerPage = 6;
  const numOfPages = Math.ceil(events.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const EventRows = (): JSX.Element[] =>
    sortedEvents
      // pagination filter
      .filter(
        (p: Event, i) =>
          i < currentPage * rowsPerPage && i >= (currentPage - 1) * rowsPerPage
      )
      .map((event) => (
        <Tr key={event.uuid}>
          <Td>{event.cancellationReasonId}</Td>
          <Td css={event.isCancelled ? cancelStyle : undefined}>
            {dayjs(event.startTime).format('dd DD.MM.YY HH:mm')}
          </Td>
          <Td>{event.employee?.alias}</Td>
          <Td>
            <Icon
              as={event.isDiagnostic ? RiCheckLine : RiCheckboxBlankLine}
              w={5}
              h={5}
              color={event.isDiagnostic ? 'indigo' : 'gray.400'}
            />
          </Td>
        </Tr>
      ));
  return (
    <>
      <Table variant="striped" size="sm" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>{t('label.cancelled')}</Th>
            <Th>{t('label.date')}</Th>
            <Th>{t('label.therapist')}</Th>
            <Th>{t('label.diagnostic')}</Th>
          </Tr>
        </Thead>
        <Tbody>{EventRows()}</Tbody>
      </Table>
      {/* pagination controls START */}
      <Flex m={2} alignSelf="flex-end">
        <IconButton
          aria-label="previous page"
          leftIcon={<CgChevronLeft />}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        {new Array(numOfPages).fill(numOfPages).map((_, index) => (
          <Button
            disabled={index + 1 === currentPage}
            key={index}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <IconButton
          aria-label="next page"
          icon={<CgChevronRight />}
          disabled={currentPage === numOfPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Flex>
      {/* pagination controls END */}
    </>
  );
};
