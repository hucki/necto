import {
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import * as colors from '../../../styles/colors';
import React, { useEffect, useState } from 'react';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { RiCloseLine, RiSearchLine } from 'react-icons/ri';
import { Institution } from '../../../types/Institution';
import { IconButton } from '../../atoms/Buttons';
import { Input } from '../../Library';

interface InstitutionListProps {
  institutions: Institution[];
  // eslint-disable-next-line no-unused-vars
  onClickRow: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  showArchived: boolean;
}
const InstitutionList = ({
  institutions,
  onClickRow,
  showArchived,
}: InstitutionListProps) => {
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);
  const filteredInstitutions: Institution[] = institutions.filter(
    (institution: Institution) =>
      institution.name.toLowerCase().includes(search.toLowerCase()) ||
      institution.description.toLowerCase().includes(search.toLowerCase()) ||
      institution.street?.toLowerCase().includes(search.toLowerCase()) ||
      institution.city?.toLowerCase().includes(search.toLowerCase()) ||
      institution.contactData
        ?.filter((contact) => contact.type === 'telephone')
        .findIndex((contact) =>
          contact.contact.toLowerCase().includes(search.toLowerCase())
        ) !== -1
  ) as Institution[];
  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

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
  const tableBody = filteredInstitutions.map((institution, index) => (
    <Tr key={index} id={institution.uuid} onClick={onClickRow}>
      {tableColumns.map((key, index) => (
        <Td key={index}>{institution[key] as string}</Td>
      ))}
    </Tr>
  ));

  return (
    <>
      <Flex flexDirection={'row'} p="0.5rem">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <RiSearchLine color={colors.indigoLighten80} />
          </InputLeftElement>
          <Input
            id="search"
            name="search"
            type="text"
            value={search}
            onChange={handleSearch}
            pl="2rem"
          />
          <InputRightElement cursor="pointer" onClick={() => setSearch('')}>
            <RiCloseLine
              color={search ? colors.indigo : colors.indigoLighten80}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
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
