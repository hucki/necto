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
import { Patient, PatientInput } from '../../types/Patient';
import { DatePicker, IconButton, Input } from '../Library';
import { RiAddBoxFill, RiEditFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { useCreatePatient } from '../../hooks/patient';
import { AppState } from '../../types/AppState';
import { connect } from 'react-redux';
import { Company } from '../../types/Company';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface PatientsListProps {
  patients: Patient[];
  currentCompany: Company | undefined;
  hasActions: boolean | undefined;
}

function PatientsList({
  patients,
  currentCompany,
  hasActions = false,
}: PatientsListProps) {
  const { t } = useTranslation();

  const PatientAddRow = (currentCompany: Company | undefined): JSX.Element => {
    const [createPatient, { error: savingError }] = useCreatePatient();
    const [newPatient, setNewPatient] = useState<PatientInput>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
    const [street, setStreet] = useState('');
    const [gender, setGender] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');
    const [isAddpayFreed, setIsAddpayFreed] = useState(false);
    const [firstContactAt, setFirstContactAt] = useState(dayjs().toDate());
    const [notices, setNotices] = useState('');
    const [telephoneNumber, setTelephoneNumber] = useState('');
    const [mailAddress, setMailAddress] = useState('');

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
    function handleTelephoneChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setTelephoneNumber(event.currentTarget.value);
    }
    function handleMailChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setMailAddress(event.currentTarget.value);
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
    function handleFirstContactAtChange(date: ReactDatePickerReturnType) {
      if (date) {
        setFirstContactAt(dayjs(date.toString()).toDate());
      }
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
        firstContactAt,
        companyId: currentCompany?.uuid,
        telephoneNumber,
        mailAddress,
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
      setTelephoneNumber('');
      setMailAddress('');
      setFirstContactAt(dayjs().toDate());
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
        {/* <Td>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </Td> */}
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
          <Input
            id="telephone"
            name="telephone"
            value={telephoneNumber}
            onChange={handleTelephoneChange}
          />
        </Td>
        <Td>
          <Input
            id="mail"
            name="mail"
            value={mailAddress}
            onChange={handleMailChange}
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
          <DatePicker
            id="firstContactAt"
            name="firstContactAt"
            showTimeSelect
            locale="de"
            timeFormat="p"
            timeIntervals={15}
            dateFormat="Pp"
            selected={dayjs(firstContactAt).toDate()}
            onChange={(date: ReactDatePickerReturnType) => {
              if (date) handleFirstContactAtChange(date);
            }}
          />
        </Td>
        {hasActions && (
          <Td>
            <IconButton
              aria-label="edit patient"
              icon={<RiAddBoxFill color="green" />}
              size="md"
              onClick={() => handleSubmit()}
            />
          </Td>
        )}
      </Tr>
    );
  };
  const PatientRows = (): JSX.Element[] =>
    patients.map((p) => (
      <Tr key={p.uuid}>
        {/* <Td>{p.title}</Td> */}
        <Td>{p.firstName}</Td>
        <Td>{p.lastName}</Td>
        <Td>{p.gender}</Td>
        <Td>{p.street}</Td>
        <Td>{p.zip}</Td>
        <Td>{p.city}</Td>
        <Td>{p.notices}</Td>
        <Td>
          {p.contactData
            ?.filter((c) => c.type === 'telephone')
            .map((tel) => (
              <div key={tel.uuid}>{tel.contact}</div>
            ))}
        </Td>
        <Td>
          {p.contactData
            ?.filter((c) => c.type === 'email')
            .map((tel) => (
              <div key={tel.uuid}>{tel.contact}</div>
            ))}
        </Td>
        <Td>
          <Checkbox isReadOnly={true} isChecked={Boolean(p.isAddpayFreed)} />
        </Td>
        <Td>{dayjs(p.firstContactAt).format('ll')}</Td>
        {hasActions && (
          <Td>
            <IconButton
              disabled={true}
              aria-label="edit patient"
              icon={<RiEditFill />}
              size="xs"
            />
          </Td>
        )}
        {!hasActions && p.events?.length ? (
          <Td>
            <b>{p.events.filter(event => !event.isCancelled)[0].employee?.firstName}</b>:<br />
            {dayjs(p.events.filter(event => !event.isCancelled)[0].startTime).format('llll')}
          </Td>
        ) : null}
      </Tr>
    ));

  return (
    <Table variant="striped" size="sm" colorScheme="blue">
      <Thead>
        <Tr>
          {/* <Th width={5}>Title </Th> */}
          <Th>{t('patients.firstName')}</Th>
          <Th>{t('patients.lastName')}</Th>
          <Th width={2}>{t('patients.gender')} </Th>
          <Th>{t('patients.street')} </Th>
          <Th width={5}>{t('patients.zip')} </Th>
          <Th>{t('patients.city')} </Th>
          <Th>{t('patients.notices')} </Th>
          <Th>{t('patients.telephoneNumber')} </Th>
          <Th>{t('patients.mailAddress')} </Th>
          <Th width={5}>{t('patients.isAddpayFreed')}</Th>
          <Th width={7}>{t('patients.firstContactAt')}</Th>
          {hasActions && <Th width={5}>{t('patients.actions')}</Th>}
          {!hasActions && <Th width={5}>{t('patients.diagnostic')}</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {PatientRows()}
        {hasActions && PatientAddRow(currentCompany)}
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
