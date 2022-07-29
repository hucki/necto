import { Checkbox, GridItem, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useViewport } from '../../hooks/useViewport';
import { Institution, InstitutionInput } from '../../types/Institution';
import { Input, Label, ModalFormGroup } from '../Library';

interface InstitutionFormProps {
  institution: Institution
  onChange: (institution: Institution) => void
};



export const InstitutionForm = ({institution, onChange}: InstitutionFormProps) => {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const [currentInstitution, setCurrentInstitution] = useState<InstitutionInput>(() => ({...institution}));
  const isReadOnly = institution.archived;

  type InstitutionKey = keyof InstitutionInput;

  const autoFields: InstitutionKey[] = [
    'name',
    'description',
    'street',
    'zip',
    'city',
  ];

  const autoFormFieldKeys = autoFields;

  interface OnInputChangeProps {
    event: React.FormEvent<HTMLInputElement>
    key: InstitutionKey
  }

  function onInputChange({event, key}: OnInputChangeProps) {
    event.preventDefault();
    setCurrentInstitution(institution => ({...institution, [`${key}`]: event.currentTarget.value}));
  }
  function onCheckboxChange({event, key}: OnInputChangeProps) {
    event.preventDefault();
    setCurrentInstitution(institution => ({...institution, [`${key}`]: event.currentTarget.checked}));
  }

  interface OnSelectChangeProps {
    event: React.FormEvent<HTMLSelectElement>
    key: InstitutionKey
  }

  function onSelectChange({event, key}: OnSelectChangeProps) {
    event.preventDefault();
    const val = event.currentTarget.value === 'remove' ? null : event.currentTarget.value;
    setCurrentInstitution(institution => ({...institution, [`${key}`]: val}));
  }

  useEffect(() => {
    onChange(currentInstitution);
  }, [currentInstitution]);

  const autoFormFields = () => {
    return Object.keys(currentInstitution)
      .filter(
        (key) =>
          autoFormFieldKeys.findIndex((element) => element === key) !== -1
      )
      .map((key) =>
        typeof currentInstitution[key as keyof Institution] === 'string' ||
        typeof currentInstitution[key as keyof Institution] === 'boolean' ? (
            <ModalFormGroup key={key}>
              <Label htmlFor={key}>{t(`label.${key}`)}</Label>
              {typeof currentInstitution[key as keyof Institution] === 'boolean'
                ? (<Checkbox
                  id={key}
                  name={key}
                  size="lg"
                  disabled={isReadOnly}
                  my={2}
                  isChecked={currentInstitution[key as keyof Institution] ? true : false}
                  onChange={(e) => onCheckboxChange({event: e, key: key as keyof Institution})}
                />)
                : (<Input
                  onChange={(e) => onInputChange({event: e, key: key as keyof Institution})}
                  id={key}
                  disabled={isReadOnly}
                  value={currentInstitution[key as keyof Institution]?.toString()}>
                </Input>)}
            </ModalFormGroup>
          ) : null
      );
  };

  return (
    <>
      <SimpleGrid columns={[1, null, 2]} gap={6}>
        <GridItem>{autoFormFields()}</GridItem>
      </SimpleGrid>
    </>
  );
};