import { Icon, ModalFooter, ModalHeader } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArchive, FaEdit } from 'react-icons/fa';
import {
  RiCheckboxBlankLine,
  RiCheckLine,
  RiUser2Fill,
  RiUser5Line,
} from 'react-icons/ri';
import { Patient } from '../../types/Patient';
import {
  Button,
  ControlWrapper,
  Input,
  Label,
  ModalFormGroup,
  TextDisplay,
} from '../Library';

interface PatientInfoProps {
  patient: Patient;
}

type PatientKey = keyof Patient;

const PatientKeysToShow: PatientKey[] = [
  'gender',
  'street',
  'zip',
  'city',
  'notices',
  'careFacility',
  'isAddpayFreed',
  'careFacility',
];

export const PatientInfo = ({ patient }: PatientInfoProps) => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const { t } = useTranslation();
  return (
    <>
      <ModalHeader alignItems="center" display="flex">
        <Icon as={RiUser5Line} w={10} h={10} mr={2} />
        {patient.lastName + ', ' + patient.firstName}
      </ModalHeader>
      {Object.keys(patient)
        .filter(
          (key) =>
            PatientKeysToShow.findIndex((element) => element === key) !== -1
        )
        .map((key) =>
          typeof patient[key as keyof Patient] === 'string' ||
          typeof patient[key as keyof Patient] === 'boolean' ? (
              <ModalFormGroup key={key}>
                <Label htmlFor={key}>{t(`patients.${key}`)}</Label>
                {typeof patient[key as PatientKey] === 'boolean' ? (
                  <Icon
                    id={key}
                    as={
                      patient[key as PatientKey]
                        ? RiCheckLine
                        : RiCheckboxBlankLine
                    }
                    w={5}
                    h={5}
                    color={patient[key as PatientKey] ? 'indigo' : 'gray.400'}
                  />
                ) :
                  isReadOnly ? (
                    <TextDisplay id={key}>
                      {patient[key as PatientKey]?.toString()}&nbsp;
                    </TextDisplay>
                  ) : (
                    <Input readOnly id={key} value={patient[key as PatientKey]?.toString()}></Input>
                  )}
              </ModalFormGroup>
            ) : null
        )}
      <ModalFooter
        css={{
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="row"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <ControlWrapper>
            <Button
              leftIcon={<FaArchive />}
              aria-label="delete event"
              colorScheme="red"
              size="sm"
              type="button"
              onClick={() => console.log('archive patient')}
            >
              {t('button.archive')}
            </Button>
          </ControlWrapper>
          <ControlWrapper>
            {isReadOnly ? (
              <Button
                leftIcon={<FaEdit />}
                aria-label="edit event"
                type="button"
                onClick={() => setIsReadOnly(!isReadOnly)}
                colorScheme="blue"
                size="sm"
              >
                {t('button.edit')}
              </Button>
            ) : (
              <Button
                aria-label="save changes"
                type="button"
                disabled={isReadOnly}
                onClick={() => setIsReadOnly(!isReadOnly)}
                size="sm"
                colorScheme="blue"
              >
                {t('button.save')}
              </Button>
            )}
          </ControlWrapper>
        </div>
      </ModalFooter>
    </>
  );
};
