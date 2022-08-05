import { Input as ChakraInput, Select as ChakraSelect, FormLabel as ChakraFormLabel } from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import ReactDatePicker from 'react-datepicker';

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
  zIndex: 2,
  position: 'absolute',
  backgroundColor: 'white',
  pointerEvents: 'none',
  margin: '3px 2px',
  padding: '1px 4px',
  transformOrigin: 'left top'
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

const ModalFormGroup = styled.div(
  {
    display: 'grid',
    alignItems: 'center',
    marginBottom: '0.75rem'
  }
);

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

export { Input, Textarea, FormGroup, FormLabel, Label, Select, DatePicker, RadioGroup, ModalFormGroup, TextDisplay };
