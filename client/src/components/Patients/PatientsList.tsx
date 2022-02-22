/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
import { Patient } from '../../types/Patient';

interface PatientsListProps {
  patients: Patient[];
}

function PatientsList({ patients }: PatientsListProps) {
  const PatientRows = (): JSX.Element[] =>
    patients.map((p) => (
      <Tr key={p.uuid}>
        <Td>{p.firstName}</Td>
        <Td>{p.lastName}</Td>
      </Tr>
    ));

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>FirstName</Th>
          <Th>LastName </Th>
        </Tr>
      </Thead>
      <Tbody>{PatientRows()}</Tbody>
    </Table>
  );
}

export { PatientsList };
