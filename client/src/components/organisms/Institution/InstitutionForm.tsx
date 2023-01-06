import { FormControl, GridItem, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateInstitutionContact } from '../../../hooks/contact';
import { ContactData, ContactType } from '../../../types/ContactData';
import { Institution, InstitutionInput } from '../../../types/Institution';
import { ContactInput } from '../../atoms/ContactData/ContactInput';
import CreateContactButton from '../../atoms/ContactData/CreateContactButton';
import { FormLabel, Input, Checkbox } from '../../Library';

interface InstitutionFormProps {
  institution: Institution;
  // eslint-disable-next-line no-unused-vars
  onChange: (
    // eslint-disable-next-line no-unused-vars
    institution: Institution,
    // eslint-disable-next-line no-unused-vars
    contactDataCollection: ContactData[]
  ) => void;
}

export const InstitutionForm = ({
  institution,
  onChange,
}: InstitutionFormProps) => {
  const { t } = useTranslation();
  const [currentInstitution, setCurrentInstitution] =
    useState<InstitutionInput>(() => ({ ...institution }));
  const [currentContactDataCollection, setCurrentContactDataCollection] =
    useState<ContactData[]>(() => {
      return (institution.contactData as ContactData[]) || [];
    });
  const isReadOnly = Boolean(institution.archived);

  type InstitutionKey = keyof InstitutionInput;

  const { mutateAsync: createInstitutionContact } =
    useCreateInstitutionContact();

  const createContact = (type: ContactType) => {
    createInstitutionContact({
      contactData: {
        institutionId: currentInstitution.uuid,
        type,
        contact: '',
      },
    }).then((contact) =>
      setCurrentContactDataCollection((cur) =>
        contact ? [...cur, contact] : cur
      )
    );
  };

  interface OnContactChangeProps {
    event: React.FormEvent<HTMLInputElement>;
    id: string;
  }

  function onContactChange({ event, id }: OnContactChangeProps) {
    event.preventDefault();
    const newContact = event.currentTarget.value;
    setCurrentContactDataCollection((contactData) =>
      contactData.map((c) =>
        c.uuid === id ? { ...c, contact: newContact } : c
      )
    );
  }

  const phoneFromContact = () => {
    const currentPhones = currentContactDataCollection
      .filter((c) => c.type === 'telephone')
      .map((contact, index) => (
        <ContactInput
          key={index}
          isDisabled={isReadOnly}
          contact={contact}
          onChange={onContactChange}
        />
      ));

    return (
      <>
        {(currentPhones.length && currentPhones) || null}
        {!currentPhones.length && !isReadOnly ? (
          <CreateContactButton
            isDisabled={!currentInstitution.uuid}
            type="telephone"
            onCreate={createContact}
          />
        ) : null}
      </>
    );
  };

  const faxFromContact = () => {
    const currentFaxes = currentContactDataCollection
      .filter((c) => c.type === 'fax')
      .map((contact, index) => (
        <ContactInput
          key={index}
          isDisabled={isReadOnly}
          contact={contact}
          onChange={onContactChange}
        />
      ));

    return (
      <>
        {(currentFaxes.length && currentFaxes) || null}
        {!currentFaxes.length && !isReadOnly ? (
          <CreateContactButton
            isDisabled={!currentInstitution.uuid}
            type="fax"
            onCreate={createContact}
          />
        ) : null}
      </>
    );
  };

  const autoFields: InstitutionKey[] = [
    'name',
    'description',
    'street',
    'zip',
    'city',
  ];

  const autoFormFieldKeys = autoFields;

  interface OnInputChangeProps {
    event: React.FormEvent<HTMLInputElement>;
    key: InstitutionKey;
  }

  function onInputChange({ event, key }: OnInputChangeProps) {
    event.preventDefault();
    setCurrentInstitution((institution) => ({
      ...institution,
      [`${key}`]: event.currentTarget.value,
    }));
  }
  function onCheckboxChange({ event, key }: OnInputChangeProps) {
    event.preventDefault();
    setCurrentInstitution((institution) => ({
      ...institution,
      [`${key}`]: event.currentTarget.checked,
    }));
  }

  useEffect(() => {
    onChange(currentInstitution, currentContactDataCollection);
  }, [currentInstitution, currentContactDataCollection]);

  const autoFormFields = () => {
    return Object.keys(currentInstitution)
      .filter(
        (key) =>
          autoFormFieldKeys.findIndex((element) => element === key) !== -1
      )
      .map((key) =>
        typeof currentInstitution[key as keyof Institution] === 'string' ||
        typeof currentInstitution[key as keyof Institution] === 'boolean' ? (
          <FormControl key={key} id={key} mb="0.75rem">
            {typeof currentInstitution[key as keyof Institution] ===
            'boolean' ? (
              <Checkbox
                name={key}
                size="lg"
                disabled={isReadOnly}
                my={2}
                isChecked={
                  currentInstitution[key as keyof Institution] ? true : false
                }
                onChange={(e) =>
                  onCheckboxChange({ event: e, key: key as keyof Institution })
                }
              />
            ) : (
              <Input
                name={key}
                onChange={(e) =>
                  onInputChange({ event: e, key: key as keyof Institution })
                }
                disabled={isReadOnly}
                value={currentInstitution[key as keyof Institution]?.toString()}
              ></Input>
            )}
            <FormLabel>{t(`label.${key}`)}</FormLabel>
          </FormControl>
        ) : null
      );
  };

  return (
    <>
      <SimpleGrid columns={[1, null, 2]} gap={6}>
        <GridItem>
          {autoFormFields()}
          {phoneFromContact()}
          {faxFromContact()}
        </GridItem>
      </SimpleGrid>
    </>
  );
};
