import { Checkbox, GridItem, Icon, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { useViewport } from '../../hooks/useViewport';
import { Institution, InstitutionInput } from '../../types/Institution';
import { Input, Label, ModalFormGroup, TextDisplay } from '../Library';

interface InstitutionFormProps {
  institution: Institution
  type: 'create' | 'update' | 'view'
  onChange: (institution: Institution) => void
};



export const InstitutionForm = ({institution, type = 'view', onChange}: InstitutionFormProps) => {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const [currentInstitution, setCurrentInstitution] = useState<InstitutionInput>(() => ({...institution}));

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
                ? type === 'view'
                  ? (<Icon
                    id={key}
                    as={
                      currentInstitution[key as keyof Institution]
                        ? RiCheckLine
                        : RiCheckboxBlankLine
                    }
                    w={5}
                    h={5}
                    color={currentInstitution[key as keyof Institution] ? 'indigo' : 'gray.400'}
                  />)
                  : (<Checkbox
                    id={key}
                    name={key}
                    size="lg"
                    my={2}
                    isChecked={currentInstitution[key as keyof Institution] ? true : false}
                    onChange={(e) => onCheckboxChange({event: e, key: key as keyof Institution})}
                  />)
                : type === 'view'
                  ? (<TextDisplay id={key}>
                    {currentInstitution[key as keyof Institution]?.toString()}&nbsp;
                  </TextDisplay>)
                  : (<Input
                    onChange={(e) => onInputChange({event: e, key: key as keyof Institution})}
                    id={key}
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