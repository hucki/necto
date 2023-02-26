import { Button, Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoTrash } from 'react-icons/io5';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { IconButton } from '../../atoms/Buttons';
import { SettingsWrapper } from '../../atoms/Wrapper';
import {
  useAllCancellationReasons,
  useCreateCancellationReason,
  useDeleteCancellationReason,
} from '../../../hooks/events';
import { CancellationReason } from '../../../types/Event';
import { FormGroup, LabelledInput } from '../../Library';

const CancellationReasonSettings = () => {
  const emptyCancellationReason = {
    id: '',
    description: '',
  };
  const { isLoading, cancellationReasons } = useAllCancellationReasons();
  const { mutateAsync: createCancellationReason } =
    useCreateCancellationReason();
  const { mutateAsync: deleteCancellationReason } =
    useDeleteCancellationReason();
  const [newCancellationReason, setNewCancellationReason] = useState(() => ({
    ...emptyCancellationReason,
  }));

  const handleSubmit = () => {
    if (
      cancellationReasons.findIndex(
        (cr) => cr.id === newCancellationReason.id
      ) !== -1
    ) {
      return;
    }
    if (newCancellationReason.id && newCancellationReason.description) {
      createCancellationReason({ cr: newCancellationReason }).finally(() =>
        setNewCancellationReason(() => ({ ...emptyCancellationReason }))
      );
    }
  };

  const handleChange = (
    event: React.FormEvent<HTMLInputElement>,
    id: 'id' | 'description'
  ) => {
    event.preventDefault();
    const newCR = { ...newCancellationReason };
    newCR[id] = event.currentTarget.value;
    setNewCancellationReason(newCR);
  };

  const handleDelete = (id: CancellationReason['id']) => {
    deleteCancellationReason({ id });
  };

  const CurrentCancellationReasons = () => {
    if (!cancellationReasons.length) return null;
    return (
      <List>
        {cancellationReasons.map((cr) => (
          <ListItem key={cr.id}>
            <ListIcon as={RiArrowDropRightLine} />
            <b>{cr.id}</b> | <span>{cr.description}</span>
            {cr._count.events <= 0 && (
              <IconButton
                size="sm"
                icon={<IoTrash />}
                colorScheme="red"
                onClick={() => handleDelete(cr.id)}
                aria-label="delete cancellation Reason"
                isDisabled={cr._count.events > 0}
              />
            )}
          </ListItem>
        ))}
      </List>
    );
  };
  return (
    <>
      <SettingsWrapper>
        <Heading as="h3" size="md" mb="2" mt="5">
          Cancellation Reasons
        </Heading>
        {isLoading ? (
          'pending'
        ) : cancellationReasons.length ? (
          <CurrentCancellationReasons />
        ) : (
          'no cancellationReasons'
        )}
        <Heading as="h3" size="md" mb="2" mt="5">
          new Reason
        </Heading>
        <LabelledInput
          label="Id"
          id="cancellationReasonId"
          name="cancellationReasonId"
          value={newCancellationReason.id}
          onChangeHandler={(e) => handleChange(e, 'id')}
          type="text"
        />
        <LabelledInput
          label="Description"
          id="cancellationReasonDescription"
          name="cancellationReasonDescription"
          value={newCancellationReason.description}
          onChangeHandler={(e) => handleChange(e, 'description')}
          type="text"
        />
        <FormGroup>
          <Button onClick={handleSubmit}>Save</Button>
        </FormGroup>
      </SettingsWrapper>
    </>
  );
};

export default CancellationReasonSettings;
