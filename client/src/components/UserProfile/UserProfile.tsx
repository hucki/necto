/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { FormEvent, useEffect, useState } from 'react';

import {
  useCreateUserSettings,
  useUpdateUser,
  useUser,
} from '../../hooks/user';
// import { useAllEmployees } from '../../hooks/employees';
import { Input, LabelledInput } from '../Library';
import { RiEditFill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import { updatePassword } from '../../services/Auth';
import { UpdateResponse } from '../../types/Auth';

interface UserProfileProps {
  id: string;
}

const UserProfile = ({ id }: UserProfileProps): JSX.Element => {
  const { t } = useTranslation();
  const { isLoading, user } = useUser(id);
  const [updateUser] = useUpdateUser();
  const [response, setResponse] = useState<UpdateResponse | undefined>();
  const [createUserSettings] = useCreateUserSettings();
  // const {
  //   isLoading: isLoadingEmployees,
  //   error,
  //   employees,
  //   refetch,
  // } = useAllEmployees();
  const [state, setState] = useState<'view' | 'edit'>('view');
  const [userState, setUserState] = useState({
    uuid: user?.uuid,
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    email: user ? user.email : '',
    // employeeId: user && user?.userSettings?.length &&
    // user.userSettings[0].employeeId ? user.userSettings[0].employeeId : '',
  });
  const [passwordState, setPasswordState] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });
  const [passwordUpdateResponse, setPasswordUpdateResponse] = useState<
    string | undefined
  >();
  const toast = useToast();
  const updatePasswordErrorOptions: UseToastOptions = {
    title: 'Password not updated.',
    description: `Password not updated: ${passwordUpdateResponse}!`,
    status: 'error',
    duration: 4000,
    isClosable: true,
  };
  const updatePasswordSuccessOptions: UseToastOptions = {
    title: 'Password updated.',
    description: 'Password was sucessfully updated!',
    status: 'success',
    duration: 4000,
    isClosable: true,
  };
  const isChangingPassword =
    passwordState.oldPassword ||
    passwordState.newPassword ||
    passwordState.newPasswordConfirmation;
  const newPasswordConfirmed =
    passwordState.newPassword === passwordState.newPasswordConfirmation;
  const isReadyToSubmit =
    !isChangingPassword ||
    (passwordState.oldPassword &&
      passwordState.newPassword &&
      newPasswordConfirmed);

  useEffect(() => {
    if (!isLoading && user?.uuid && !user.userSettings?.length) {
      createUserSettings({
        userSettings: {
          userId: user.uuid,
        },
      });
    }
    if (!isLoading && user) {
      setUserState((currentState) => ({
        ...currentState,
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        // employeeId: user?.userSettings?.length && user.userSettings[0].employeeId ? user.userSettings[0].employeeId : '',
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
  const onPasswordChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setPasswordState((currentState) => ({
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
    onUpdatePassword();
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
            // employeeId: userState.employeeId,
          },
        ],
      },
    });
  };

  const onUpdatePassword = async () => {
    if (!isChangingPassword || !newPasswordConfirmed) return;
    try {
      const response = await updatePassword({
        oldPassword: passwordState.oldPassword,
        newPassword: passwordState.newPassword,
      });
      setPasswordUpdateResponse(response);
      toast(updatePasswordSuccessOptions);
      // console.log('✅ changePassword response:', response);
    } catch (error) {
      setPasswordUpdateResponse(error as string);
      toast(updatePasswordErrorOptions);
      // console.log('❌ changePassword error:', error);
    }
    setPasswordState({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
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
          '> div, h2, button': {
            margin: '10px auto',
            width: '100%',
            maxWidth: '300px',
          },
        }}
      >
        <Heading as="h2" size="md">
          {t('menu.personalData')}
        </Heading>
        <LabelledInput
          label={t('label.firstName')}
          disabled={state === 'view'}
          type="text"
          name="firstName"
          id="firstName"
          autoComplete="given-name"
          value={userState.firstName}
          onChangeHandler={onChangeHandler}
        />
        <LabelledInput
          label={t('label.lastName')}
          disabled={state === 'view'}
          type="text"
          name="lastName"
          id="lastName"
          autoComplete="family-name"
          value={userState.lastName}
          onChangeHandler={onChangeHandler}
        />
        {/* <FormGroup>
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
        </FormGroup> */}
        <Heading as="h2" size="md">
          {t('auth.password')}
        </Heading>
        <Input
          type="text"
          name="email"
          hidden
          readOnly
          autoComplete="username"
          value={userState.email}
        />
        <LabelledInput
          label={t('auth.oldPassword')}
          disabled={state === 'view'}
          type="password"
          name="oldPassword"
          id="oldPassword"
          autoComplete="old-password"
          value={passwordState.oldPassword}
          onChangeHandler={onPasswordChangeHandler}
        />
        <LabelledInput
          label={t('auth.newPassword')}
          disabled={state === 'view'}
          type="password"
          name="newPassword"
          id="newPassword"
          autoComplete="new-password"
          value={passwordState.newPassword}
          onChangeHandler={onPasswordChangeHandler}
        />
        <FormControl isInvalid={!newPasswordConfirmed}>
          <LabelledInput
            label={t('auth.confirmPassword')}
            disabled={state === 'view'}
            type="password"
            name="newPasswordConfirmation"
            id="newPasswordConfirmation"
            autoComplete="new-password"
            value={passwordState.newPasswordConfirmation}
            onChangeHandler={onPasswordChangeHandler}
          />

          {!newPasswordConfirmed && (
            <FormErrorMessage>new password has to match</FormErrorMessage>
          )}
        </FormControl>
        {state === 'view' ? (
          <Button aria-label="toggle edit mode" onClick={toggleEdit}>
            <RiEditFill />
          </Button>
        ) : (
          <div>
            <Button
              aria-label="save changes"
              type="submit"
              disabled={!isReadyToSubmit}
            >
              {t('button.save')}
            </Button>
            <Button
              aria-label="cancel changes"
              type="button"
              onClick={cancelEdit}
            >
              {t('button.cancel')}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
