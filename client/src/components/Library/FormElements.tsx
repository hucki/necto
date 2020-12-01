import styled from '@emotion/styled/macro'

const inputStyles = {
  border: '1px solid #f1f1f4',
  padding: '8px 12px',
}

const Label = styled.label(
  {
    borderRadius: '3px',
    fontWeight: 'bold',
  },
  inputStyles,
)

interface InputCallbackProps {
  disabled?: boolean;
}
const Input = styled.input(
  {
    borderRadius: '3px'
  },
  inputStyles,
  ({disabled}: InputCallbackProps) => (disabled
    ? {
        background: '#f1f1f4',
        fontStyle: 'italic'
      }
    : {
        background: 'white'
      }),
  )
const Textarea = styled.textarea(inputStyles)
const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'row',
})

export {Input, Textarea, FormGroup, Label};