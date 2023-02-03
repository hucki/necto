import { GridItem, Icon, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { getDisplayName } from '../../../helpers/displayNames';
import { useAllDoctors } from '../../../hooks/doctor';
import { Patient } from '../../../types/Patient';
import {
  Input,
  Label,
  ModalFormGroup,
  Select,
  TextDisplay,
} from '../../Library';

interface PatientFormProps {
  patient: Patient;
  type: 'create' | 'update' | 'view';
  // eslint-disable-next-line no-unused-vars
  onChange: (patient: Patient) => void;
}

type PatientKey = keyof Patient;

const autoFormFieldKeys: PatientKey[] = [
  'firstName',
  'lastName',
  'gender',
  'street',
  'zip',
  'city',
  'notices',
  'careFacility',
  'isAddpayFreed',
  'careFacility',
  'medicalReport',
];

export const PatientForm = ({
  patient,
  type = 'view',
  onChange,
}: PatientFormProps) => {
  const { t } = useTranslation();
  const { doctors } = useAllDoctors();
  const [currentPatient, setCurrentPatient] = useState<Patient>(() => ({
    ...patient,
  }));

  interface OnInputChangeProps {
    event: React.FormEvent<HTMLInputElement>;
    key: PatientKey;
  }

  function onInputChange({ event, key }: OnInputChangeProps) {
    event.preventDefault();
    setCurrentPatient((patient) => ({
      ...patient,
      [`${key}`]: event.currentTarget.value,
    }));
  }

  interface OnSelectChangeProps {
    event: React.FormEvent<HTMLSelectElement>;
    key: PatientKey;
  }

  function onSelectChange({ event, key }: OnSelectChangeProps) {
    event.preventDefault();
    const val =
      event.currentTarget.value === 'remove' ? null : event.currentTarget.value;
    setCurrentPatient((patient) => ({ ...patient, [`${key}`]: val }));
  }

  useEffect(() => {
    onChange(currentPatient);
  }, [currentPatient]);

  const autoFormFields = () => {
    return Object.keys(currentPatient)
      .filter(
        (key) =>
          autoFormFieldKeys.findIndex((element) => element === key) !== -1
      )
      .map((key) =>
        typeof currentPatient[key as keyof Patient] === 'string' ||
        typeof currentPatient[key as keyof Patient] === 'boolean' ? (
          <ModalFormGroup key={key}>
            <Label htmlFor={key}>{t(`label.${key}`)}</Label>
            {typeof currentPatient[key as PatientKey] === 'boolean' ? (
              <Icon
                id={key}
                as={
                  currentPatient[key as PatientKey]
                    ? RiCheckLine
                    : RiCheckboxBlankLine
                }
                w={5}
                h={5}
                color={
                  currentPatient[key as PatientKey] ? 'indigo' : 'gray.400'
                }
              />
            ) : type === 'view' ? (
              <TextDisplay id={key}>
                {currentPatient[key as PatientKey]?.toString()}&nbsp;
              </TextDisplay>
            ) : (
              <Input
                autoComplete="off"
                onChange={(e) =>
                  onInputChange({ event: e, key: key as PatientKey })
                }
                id={key}
                value={currentPatient[key as PatientKey]?.toString()}
              ></Input>
            )}
          </ModalFormGroup>
        ) : null
      );
  };
  return (
    <>
      <SimpleGrid columns={[1, null, 2]} gap={6}>
        <GridItem>{autoFormFields()}</GridItem>
        <GridItem>
          <ModalFormGroup>
            <Label htmlFor="doctorId">{t('label.doctor')}</Label>
            {type === 'view' ? (
              <TextDisplay id="doctorId">
                {currentPatient['doctor'] &&
                  getDisplayName({
                    person: currentPatient['doctor'],
                    type: 'short',
                  })}
              </TextDisplay>
            ) : (
              <>
                <Select
                  name="employee"
                  value={currentPatient['doctorId']}
                  onChange={(e) =>
                    onSelectChange({ event: e, key: 'doctorId' })
                  }
                >
                  <option value={'remove'}>No Doctor</option>
                  {doctors.map((t, i) => (
                    <option key={i} value={t.uuid}>
                      {t.firstName + ' ' + t.lastName}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </ModalFormGroup>
        </GridItem>
      </SimpleGrid>
      <b>Termine:</b>
      {currentPatient.events &&
        currentPatient.events.map((event) => (
          <div key={event.uuid}>{event.startTime.format('lll')}</div>
        ))}
    </>
  );
};
