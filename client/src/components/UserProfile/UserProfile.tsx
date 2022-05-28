/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { FormEvent, useEffect, useState } from 'react';

import {
  useCreateUserSettings,
  useUpdateUser,
  useUser,
} from '../../hooks/user';
import { useAllEmployees } from '../../hooks/employees';
import { FormGroup, Input, Button, Label, Select } from '../Library';
import { RiEditFill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';

interface UserProfileProps {
  id: string;
}

const UserProfile = ({
  id
}: UserProfileProps): JSX.Element => {
  const { t } = useTranslation();
  const { isLoading, user } = useUser(id);
  const [updateUser] = useUpdateUser();
  const [createUserSettings] = useCreateUserSettings();
  const {
    isLoading: isLoadingEmployees,
    error,
    employees,
    refetch,
  } = useAllEmployees();
  const [state, setState] = useState<'view' | 'edit'>('view');
  const [userState, setUserState] = useState({
    uuid: user?.uuid,
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    employeeId: user && user?.userSettings?.length &&
    user.userSettings[0].employeeId ? user.userSettings[0].employeeId : '',
  });
  useEffect(() => {
    if (!isLoading && user?.uuid && !user.userSettings?.length) {
      createUserSettings({
        userSettings: {
          userId: user.uuid,
        },
      });
    }
    if ( !isLoading && user ) {
      setUserState((currentState) => ({
        ...currentState,
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        employeeId: user?.userSettings?.length && user.userSettings[0].employeeId ? user.userSettings[0].employeeId : '',
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
    setUserState((currentState) => ({
      ...currentState,
      employeeId: e.target.value,
    }));
  };

  const onSubmitHandler = (e: FormEvent): void => {
    e.preventDefault();
    onUpdateUser();
    toggleEdit(e);
  };

  const cancelEdit = () => {
    setState((currentState) => (currentState === 'view' ? 'edit' : 'view'));
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
  if (!isLoading && !user) return <div>no user</div>;
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
        <FormGroup>
          <Label htmlFor="employee">Employee</Label>
          <Select
            disabled={state === 'view'}
            name="employeeId"
            value={userState.employeeId}
            onChange={onSelectHandler}
          >
            {employees.filter(e => !e.user || e.user.userId === userState.uuid).map((e, i) => (
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
          <div>
            <Button aria-label="save changes" type="submit">
              {t('button.save')}
            </Button>
            <Button aria-label="cancel changes" type="button" onClick={cancelEdit}>
              {t('button.cancel')}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
