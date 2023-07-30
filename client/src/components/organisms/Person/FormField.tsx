import React from 'react';
import {
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  ModalFormGroup,
} from '../../Library';
import { Person } from '../../../types/Person';
import { useTranslation } from 'react-i18next';
import { OnInputChangeProps } from './PersonForm';

interface PersonFormFieldProps {
  fieldKey: string | undefined;
  person: Person;
  isDisabled: boolean;
  // eslint-disable-next-line no-unused-vars
  onInputChange: ({ event, key }: OnInputChangeProps) => void;
  // eslint-disable-next-line no-unused-vars
  onCheckboxChange: ({ event, key }: OnInputChangeProps) => void;
}
export const PersonFormField = ({
  fieldKey,
  person,
  isDisabled,
  onCheckboxChange,
  onInputChange,
}: PersonFormFieldProps) => {
  const { t } = useTranslation();
  return (
    <ModalFormGroup key={fieldKey}>
      <FormControl id={fieldKey}>
        {typeof person[fieldKey as keyof Person] === 'boolean' ? (
          <Checkbox
            name={fieldKey}
            isDisabled={isDisabled}
            size="lg"
            my={2}
            isChecked={person[fieldKey as keyof Person] ? true : false}
            onChange={(e) =>
              onCheckboxChange({ event: e, key: fieldKey as keyof Person })
            }
          />
        ) : (
          <Input
            autoComplete="off"
            isDisabled={isDisabled}
            onChange={(e) =>
              onInputChange({ event: e, key: fieldKey as keyof Person })
            }
            id={fieldKey}
            value={person[fieldKey as keyof Person]?.toString()}
          ></Input>
        )}
        <FormLabel>{t(`label.${fieldKey}`)}</FormLabel>
      </FormControl>
    </ModalFormGroup>
  );
};
