import React from 'react';
import { CgAdd, CgPhone } from 'react-icons/cg';
import { IoDocumentTextOutline, IoMailOutline } from 'react-icons/io5';
import { ContactType } from '../../../types/ContactData';
import { FormControl, FormLabel, ModalFormGroup } from '../../Library';
import { IconButton } from '../Buttons';

type CreateContactButtonProps = {
  isDisabled: boolean;
  type: ContactType;
  // eslint-disable-next-line no-unused-vars
  onCreate: (type: ContactType) => void;
};

const CreateContactButton = ({
  isDisabled,
  type,
  onCreate,
}: CreateContactButtonProps) => {
  return (
    <ModalFormGroup>
      <FormControl id="addPhone">
        <IconButton
          disabled={isDisabled}
          aria-label="add-phone"
          icon={<CgAdd />}
          onClick={() => onCreate(type)}
        />
        <FormLabel>
          {type === 'telephone' ? (
            <CgPhone />
          ) : type === 'email' ? (
            <IoMailOutline />
          ) : (
            <IoDocumentTextOutline />
          )}
        </FormLabel>
      </FormControl>
    </ModalFormGroup>
  );
};

export default CreateContactButton;
