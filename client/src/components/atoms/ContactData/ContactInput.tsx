import React from 'react';
import { CgPhone } from 'react-icons/cg';
import { IoDocumentTextOutline, IoMailOutline } from 'react-icons/io5';
import { ContactData } from '../../../types/ContactData';
import { FormControl, FormLabel, Input, ModalFormGroup } from '../../Library';

type OnChangeProps = {
  event: React.FormEvent<HTMLInputElement>;
  id: string;
};

type ContactInputProps = {
  contact: ContactData;
  isDisabled: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: ({ event, id }: OnChangeProps) => void;
};

export const ContactInput = ({
  contact,
  isDisabled,
  onChange,
}: ContactInputProps) => {
  return (
    <ModalFormGroup>
      <FormControl id={contact.type + '_' + contact.uuid}>
        <Input
          isDisabled={isDisabled}
          onChange={(e) => onChange({ event: e, id: contact.uuid || '' })}
          id={contact.uuid}
          value={contact.contact}
          autoComplete="off"
        />
        <FormLabel>
          {contact.type === 'telephone' ? (
            <CgPhone />
          ) : contact.type === 'email' ? (
            <IoMailOutline />
          ) : (
            <IoDocumentTextOutline />
          )}
        </FormLabel>
      </FormControl>
    </ModalFormGroup>
  );
};
