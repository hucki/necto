/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { FormEvent, useState } from 'react';

import { useAddUser, useAuth0User } from '../../hooks/user';
import { FormGroup, Input, Button, Label } from '../Library';
import { RiEditFill } from 'react-icons/ri';

interface UserProfileProps {
  purpose?: string;
  a0Id: string;
}

const UserProfile = ({
  purpose = 'view',
  a0Id,
}: UserProfileProps): JSX.Element => {
  const [createUser] = useAddUser();
  const [state, setState] = useState(purpose);
  const { user, isLoading } = useAuth0User(a0Id);
  const [userState, setUserState] = useState({
    a0Id: a0Id,
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setUserState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmitHandler = (e: FormEvent): void => {
    e.preventDefault();
    state === 'new'
      ? createUser({ user: userState })
      : console.log('Update function coming later');
    toggleEdit(e);
  };
  const toggleEdit = (e: FormEvent): void => {
    e.preventDefault();
    setState((currentState) => (currentState === 'view' ? 'edit' : 'view'));
  };

  if (isLoading) return <div>fetching data</div>;
  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          '> div': {
            margin: '10px auto',
            width: '100%',
            maxWidth: '300px',
          },
        }}
      >
        <FormGroup>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            disabled={state === 'view'}
            type="text"
            name="firstName"
            value={userState.firstName}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            disabled={state === 'view'}
            type="text"
            name="lastName"
            value={userState.lastName}
            onChange={onChangeHandler}
          />
        </FormGroup>
        {state === 'view' ? (
          <Button aria-label="toggle edit mode" onClick={toggleEdit}>
            <RiEditFill />
          </Button>
        ) : (
          <Button aria-label="save changes" type="submit">
            {state === 'new' ? 'Create User' : 'Save changes'}
          </Button>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
