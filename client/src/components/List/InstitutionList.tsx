import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { Institution } from '../../types/Institution';

interface InstitutionListProps {
  institutions: Institution[]
  onClickRow: (event: React.MouseEvent<HTMLTableRowElement>) => void
  showArchived: boolean
}
const InstitutionList = ({
  institutions,
  onClickRow,
  showArchived
}:InstitutionListProps) => {


  const tableColumns: (keyof Institution)[] = ['name', 'description', 'street', 'zip', 'city'];
  const tableHead = <Tr>{tableColumns.map((column, index) => <Th key={index}>{column}</Th>)}</Tr>;
  const tableBody = institutions.map((institution, index) =>
    <Tr key={index} id={institution.uuid} onClick={onClickRow}>
      {tableColumns.map((key, index) => <Td key={index}>{institution[key]}</Td>)}
    </Tr>
  );

  return <>
    <Table size="sm" colorScheme={showArchived ? 'orange' : 'green'} variant="striped">
      <Thead>
        {tableHead}
      </Thead>
      <Tbody textDecoration={showArchived ? 'line-through' : undefined}>
        {tableBody}
      </Tbody>
    </Table>
  </>;
};

export default InstitutionList;