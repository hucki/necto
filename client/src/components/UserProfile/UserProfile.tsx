/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { FormEvent, useEffect, useState } from 'react';

import {
  useAddUser,
  useAuth0User,
  useCreateUserSettings,
  useUpdateUser,
} from '../../hooks/user';
import { useAllEmployees } from '../../hooks/employees';
import { FormGroup, Input, Button, Label, Select } from '../Library';
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
  const [updateUser] = useUpdateUser();
  const [createUserSettings] = useCreateUserSettings();
  const {
    isLoading: isLoadingEmployees,
    error,
    employees,
    refetch,
  } = useAllEmployees();
  const [state, setState] = useState(purpose);
  const { user, isLoading } = useAuth0User(a0Id);
  const [userState, setUserState] = useState({
    a0Id: a0Id,
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    employeeId: '',
  });

  useEffect(() => {
    if (!isLoading && user?.uuid && !user.userSettings?.length) {
      console.log('create UserSettings');
      createUserSettings({
        userSettings: {
          userId: user.uuid,
        },
      });
    }
    if (
      !isLoading &&
      user?.userSettings?.length &&
      user.userSettings[0].employeeId
    ) {
      setUserState((currentState) => ({
        ...currentState,
        employeeId:
          (user && user.userSettings && user.userSettings[0].employeeId) || '',
      }));
    }
  }, [user, isLoading]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setUserState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSelectHandler = (e: any): void => {
    // console.log({selected: e.target.value});
    setUserState((currentState) => ({
      ...currentState,
      employeeId: e.target.value,
    }));
  };

  const onSubmitHandler = (e: FormEvent): void => {
    e.preventDefault();
    state === 'new' ? createUser({ user: userState }) : onUpdateUser();
    toggleEdit(e);
  };

  const onUpdateUser = () => {
    if (!user?.uuid) return;
    if (!user?.userSettings?.length) return;
    updateUser({
      user: {
        uuid: user.uuid,
        a0Id: user.a0Id,
        firstName: userState.firstName,
        lastName: userState.lastName,
        userSettings: [
          {
            id: user?.userSettings[0].id,
            userId: user?.uuid,
            employeeId: userState.employeeId,
          },
        ],
      },
    });
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
        {state === 'new' && <div>Please Enter your Name and choose and connect to your employee account</div>}
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
        <FormGroup>
          <Label htmlFor="employee">Employee</Label>
          <Select
            disabled={state === 'view'}
            name="employeeId"
            value={userState.employeeId}
            onChange={onSelectHandler}
          >
            {employees.map((e, i) => (
              <option key={i} value={e.uuid}>
                {e.lastName + ', ' + e.firstName}
              </option>
            ))}
          </Select>
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
