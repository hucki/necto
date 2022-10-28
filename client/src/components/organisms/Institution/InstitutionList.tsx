import {
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { Institution } from '../../../types/Institution';
import { IconButton } from '../../atoms/Buttons';

interface InstitutionListProps {
  institutions: Institution[];
  onClickRow: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  showArchived: boolean;
}
const InstitutionList = ({
  institutions,
  onClickRow,
  showArchived,
}: InstitutionListProps) => {
  // pagination controls
  const rowsPerPage = 6;
  const numOfPages = Math.ceil(institutions.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const tableColumns: (keyof Institution)[] = [
    'name',
    'description',
    'street',
    'zip',
    'city',
  ];
  const tableHead = (
    <Tr>
      {tableColumns.map((column, index) => (
        <Th key={index}>{column}</Th>
      ))}
    </Tr>
  );
  const tableBody = institutions.map((institution, index) => (
    <Tr key={index} id={institution.uuid} onClick={onClickRow}>
      {tableColumns.map((key, index) => (
        <Td key={index}>{institution[key] as string}</Td>
      ))}
    </Tr>
  ));

  return (
    <>
      <Table
        size="sm"
        colorScheme={showArchived ? 'orange' : 'green'}
        variant="striped"
      >
        <Thead>{tableHead}</Thead>
        <Tbody textDecoration={showArchived ? 'line-through' : undefined}>
          {tableBody}
        </Tbody>
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

export default InstitutionList;
