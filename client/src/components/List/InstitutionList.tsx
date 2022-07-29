import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { Institution } from '../../types/Institution';

interface InstitutionListProps {
  institutions: Institution[]
}
const InstitutionList = ({institutions}:InstitutionListProps) => {

  const tableColumns = ['name', 'description', 'street', 'zip', 'city'];
  const tableHead = tableColumns.map((column, index) => <Th key={index}>{column}</Th>);
  const tableBody = institutions.map((institution, index) => <Tr key={index}>
    {tableColumns.map((key, index) => <Td key={index}>{institution[key as keyof Institution]}</Td>)}
  </Tr>);

  return <>
    <Table>
      <Thead>
        {tableHead}
      </Thead>
      <Tbody>
        {tableBody}
      </Tbody>
    </Table>
  </>;
};

export default InstitutionList;