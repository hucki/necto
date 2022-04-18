import styled from '@emotion/styled/macro';
import ReactDatePicker from 'react-datepicker';

const inputStyles = {
  border: '1px solid #ababab',
  padding: '0.4rem 0.2rem',
  width: '100%',
};

const Label = styled.label(inputStyles, {
  borderRadius: '3px',
  fontWeight: 'bold',
  border: '0px',
});

const Select = styled.select(inputStyles, {
  borderRadius: '3px',
  fontWeight: 'bold',
});

interface InputCallbackProps {
  disabled?: boolean;
}
const Input = styled.input(
  {
    borderRadius: '3px',
  },
  inputStyles,
  ({ disabled }: InputCallbackProps) =>
    disabled
      ? { background: '#f1f1f4', fontStyle: 'italic' }
      : { background: 'white' }
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

const RadioGroup = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

// pass props like seen here:
// https://styled-components.com/docs/basics#passed-props
const DatePicker = styled(ReactDatePicker)(inputStyles);

export { Input, Textarea, FormGroup, Label, Select, DatePicker, RadioGroup };
