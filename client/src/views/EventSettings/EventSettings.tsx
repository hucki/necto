import { Button, Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { FormGroup, LabelledInput } from '../../components/Library';
import {
  useAllCancellationReasons,
  useCreateCancellationReason,
} from '../../hooks/events';

const EventSettings = () => {
  const { isLoading, cancellationReasons } = useAllCancellationReasons();
  const { mutateAsync: createCancellationReason } =
    useCreateCancellationReason();
  const [newCancellationReason, setNewCancellationReason] = useState({
    id: '',
    description: '',
  });

  const handleSubmit = () => {
    if (
      cancellationReasons.findIndex(
        (cr) => cr.id === newCancellationReason.id
      ) !== -1
    ) {
      return;
    }
    if (newCancellationReason.id && newCancellationReason.description) {
      createCancellationReason({ cr: newCancellationReason });
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

  const CurrentCRs = () => {
    if (!cancellationReasons.length) return null;
    return (
      <List>
        {cancellationReasons.map((cr) => (
          <ListItem key={cr.id}>
            <ListIcon as={RiArrowDropRightLine} />
            <b>{cr.id}</b> | <span>{cr.description}</span>
          </ListItem>
        ))}
      </List>
    );
  };
  return (
    <>
      <Heading as="h2" size="lg">
        Event Settings
      </Heading>
      <Heading as="h3" size="md" mb="2" mt="5">
        Cancellation Reasons
      </Heading>
      {isLoading ? (
        'pending'
      ) : cancellationReasons.length ? (
        <CurrentCRs />
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
    </>
  );
};

export default EventSettings;
