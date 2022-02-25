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
  Checkbox,
} from '@chakra-ui/react';
import { Patient } from '../../types/Patient';
import { IconButton, Input } from '../Library';
import { RiAddBoxFill, RiEditFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { useCreatePatient } from '../../hooks/patient';
import { AppState } from '../../types/AppState';
import { connect } from 'react-redux';
import { Company } from '../../types/Company';

interface PatientsListProps {
  patients: Patient[];
  currentCompany: Company | undefined;
}

function PatientsList({ patients, currentCompany }: PatientsListProps) {
  const PatientAddRow = (currentCompany: Company | undefined): JSX.Element => {
    const [createPatient, { error: savingError }] = useCreatePatient();
    const [newPatient, setNewPatient] = useState<Patient>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
    const [street, setStreet] = useState('');
    const [gender, setGender] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');
    const [isAddpayFreed, setIsAddpayFreed] = useState(false);
    const [notices, setNotices] = useState('');

    function handleFirstNameChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setFirstName(event.currentTarget.value);
    }
    function handleLastNameChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setLastName(event.currentTarget.value);
    }
    function handleTitleChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setTitle(event.currentTarget.value);
    }
    function handleStreetChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setStreet(event.currentTarget.value);
    }
    function handleGenderChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setGender(event.currentTarget.value);
    }
    function handleZipChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setZip(event.currentTarget.value);
    }
    function handleCityChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setCity(event.currentTarget.value);
    }
    function handleIsAddpayFreedChange(
      event: React.FormEvent<HTMLInputElement>
    ) {
      event.preventDefault();
      setIsAddpayFreed(event.currentTarget.checked);
    }
    function handleNoticesChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setNotices(event.currentTarget.value);
    }

    function handleSubmit() {
      setNewPatient({
        firstName,
        lastName,
        title,
        gender,
        zip,
        street,
        city,
        isAddpayFreed,
        notices,
        companyId: currentCompany?.uuid,
      });
    }
    function initNewPatient() {
      setFirstName('');
      setLastName('');
      setTitle('');
      setStreet('');
      setGender('');
      setZip('');
      setCity('');
      setIsAddpayFreed(false);
      setNotices('');
    }
    useEffect(() => {
      if (!newPatient) return;
      if ((newPatient?.firstName, newPatient?.lastName)) {
        console.log('submitNewPatient', { newPatient });
        createPatient({ patient: newPatient });
        setNewPatient(undefined);
        initNewPatient();
      } else {
        alert('please check input');
      }
    }, [newPatient]);
    return (
      <Tr key="PatientAddRow">
        <Td>
          {' '}
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </Td>
        <Td>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </Td>
        <Td>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </Td>
        <Td>
          <Input
            id="gender"
            name="gender"
            value={gender}
            onChange={handleGenderChange}
          />
        </Td>
        <Td>
          <Input
            id="street"
            name="street"
            value={street}
            onChange={handleStreetChange}
          />
        </Td>
        <Td>
          <Input id="zip" name="zip" value={zip} onChange={handleZipChange} />
        </Td>
        <Td>
          <Input
            id="city"
            name="city"
            value={city}
            onChange={handleCityChange}
          />
        </Td>
        <Td>
          <Input
            id="notices"
            name="notices"
            value={notices}
            onChange={handleNoticesChange}
          />
        </Td>
        <Td>
          <Checkbox
            id="isAddpayFreed"
            name="isAddpayFreed"
            isChecked={isAddpayFreed}
            onChange={handleIsAddpayFreedChange}
          />
        </Td>
        <Td>
          <IconButton
            aria-label="edit patient"
            icon={<RiAddBoxFill />}
            size="xs"
            onClick={() => handleSubmit()}
          />
        </Td>
      </Tr>
    );
  };
  const PatientRows = (): JSX.Element[] =>
    patients.map((p) => (
      <Tr key={p.uuid}>
        <Td>{p.title}</Td>
        <Td>{p.firstName}</Td>
        <Td>{p.lastName}</Td>
        <Td>{p.gender}</Td>
        <Td>{p.street}</Td>
        <Td>{p.zip}</Td>
        <Td>{p.city}</Td>
        <Td>{p.notices}</Td>
        <Td>
          <Checkbox isReadOnly={true} isChecked={Boolean(p.isAddpayFreed)} />
        </Td>
        <Td>
          <IconButton
            disabled={true}
            aria-label="edit patient"
            icon={<RiEditFill />}
            size="xs"
          />
        </Td>
      </Tr>
    ));

  return (
    <Table variant="striped" size="sm" colorScheme="blue">
      <Thead>
        <Tr>
          <Th width={5}>Title </Th>
          <Th>FirstName</Th>
          <Th>LastName </Th>
          <Th width={2}>Gender </Th>
          <Th>Street </Th>
          <Th width={5}>Zip </Th>
          <Th>City </Th>
          <Th>Notices </Th>
          <Th width={5}>Freed?</Th>
          <Th width={5}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {PatientRows()}
        {PatientAddRow(currentCompany)}
      </Tbody>
    </Table>
  );
}

const MapStateToProps = (state: AppState) => {
  return {
    currentCompany: state.currentCompany,
  };
};

export default connect(MapStateToProps, null)(PatientsList);
