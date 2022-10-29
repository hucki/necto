import React from 'react';
import {
  Input as ChakraInput,
  Select as ChakraSelect,
  FormLabel as ChakraFormLabel,
  FormControl as ChakraFormControl,
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import ReactDatePicker from 'react-datepicker';
import { User } from '../../types/User';

const inputStyles = {
  border: '1px solid #ababab',
  width: '100%',
};

const Label = styled.label(inputStyles, {
  borderRadius: '3px',
  fontWeight: 'bold',
  border: '0px',
  marginLeft: '0.5rem',
  marginRight: '0.5rem',
});

const FormLabel = styled(ChakraFormLabel)({
  transform: 'scale(0.85) translateY(-16px)',
  top: 0,
  left: '4px',
  position: 'absolute',
  backgroundColor: 'white',
  pointerEvents: 'none',
  margin: '3px 2px',
  padding: '1px 4px',
  transformOrigin: 'left top',
  zIndex: '2',
  borderTopRightRadius: '0.5rem',
  borderTopLeftRadius: '0.5rem',
});

const TextDisplay = styled.div(inputStyles, {
  border: 'none',
  borderBottom: '1px solid #ababab',
});

const Select = styled(ChakraSelect)(inputStyles, {
  borderRadius: '3px',
  fontWeight: 'bold',
  // minWidth: '250px',
});

interface InputCallbackProps {
  disabled?: boolean;
}
const Input = styled(ChakraInput)(
  {
    borderRadius: '3px',
  },
  inputStyles,
  ({ disabled }: InputCallbackProps) =>
    disabled
      ? { background: '#f1f1f4', fontStyle: 'italic' }
      : { background: 'transparent' }
);

const Textarea = styled.textarea(inputStyles);

interface FormGroupProps {
  gridCols?: number;
  gridColsUnit?: 'auto' | '1fr';
}

const FormGroup = styled.div(
  {
    display: 'grid',
    alignItems: 'center',
  },
  ({ gridCols = 2, gridColsUnit = '1fr' }: FormGroupProps) => {
    return { gridTemplateColumns: `${(gridColsUnit + ' ').repeat(gridCols)}` };
  }
);

const ModalFormGroup = styled.div({
  display: 'grid',
  alignItems: 'center',
  marginBottom: '0.75rem',
});

const RadioGroup = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

// pass props like seen here:
// https://styled-components.com/docs/basics#passed-props
const DatePicker = styled(ReactDatePicker)(inputStyles, {
  padding: '0.4rem 0.2rem',
  background: 'transparent',
});

type CommonLabelledFormElementProps = {
  isRequired?: boolean;
  id: string;
  disabled?: boolean;
  name: string;
  label: string;
  value: string;
};
type LabelledSelectProps = CommonLabelledFormElementProps & {
  hasOptionNoSelection?: boolean;
  noSelectionLabel?: string;
  options: User[];
  // eslint-disable-next-line no-unused-vars
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

type LabelledInputProps = CommonLabelledFormElementProps & {
  autoComplete?: string;
  type?: React.HTMLInputTypeAttribute;
  // eslint-disable-next-line no-unused-vars
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormControl = styled(ChakraFormControl)({
  margin: '10px auto',
  width: '100%',
  maxWidth: '300px',
});

const LabelledSelect = ({
  id,
  isRequired = false,
  disabled = false,
  name,
  label,
  value,
  onChangeHandler,
  options,
  hasOptionNoSelection = false,
  noSelectionLabel = 'No Selection',
}: LabelledSelectProps) => {
  return (
    <FormControl id={id} isRequired={isRequired}>
      <Select
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChangeHandler}
      >
        {hasOptionNoSelection && (
          <option value={'remove'}>{noSelectionLabel}</option>
        )}
        {options.map((u, i) => (
          <option key={i} value={u.uuid}>
            {u.email + ': ' + u.lastName + ', ' + u.firstName}
          </option>
        ))}
      </Select>
      <FormLabel>{label}</FormLabel>
    </FormControl>
  );
};

const LabelledInput = ({
  id,
  isRequired,
  disabled = false,
  name,
  label,
  value,
  onChangeHandler,
  autoComplete,
  type = 'text',
}: LabelledInputProps) => {
  return (
    <FormControl id={id} style={{ margin: '5px auto' }} isRequired={isRequired}>
      <Input
        disabled={disabled}
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChangeHandler}
      />
      <FormLabel>{label}</FormLabel>
    </FormControl>
  );
};

export {
  Input,
  Textarea,
  FormGroup,
  FormLabel,
  FormControl,
  Label,
  Select,
  DatePicker,
  RadioGroup,
  ModalFormGroup,
  TextDisplay,
  LabelledInput,
  LabelledSelect,
};
