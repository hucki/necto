import {
  Button,
  FormControl,
  Heading,
  List,
  ListIcon,
  ListItem,
  Select,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowDropRightLine } from 'react-icons/ri';
import {
  FormLabel,
  LabelledInput,
  LabelledSelect,
} from '../../components/Library';
import { useAllPermissions } from '../../hooks/permissions';
import { useAllUsers, useUpdateUser } from '../../hooks/user';
import { User } from '../../types/User';
import { PermissionLevel } from '../../types/UserSettings';

export const UserSettings = () => {
  const { t } = useTranslation();
  const [updateUser] = useUpdateUser();
  const { isLoading, error, users, refetch } = useAllUsers();
  const {
    isLoading: isLoadingPermissions,
    error: permissionsError,
    permissions,
  } = useAllPermissions();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [currentPermission, setCurrentPermission] = useState<
    PermissionLevel | undefined
  >();
  const [userState, setUserState] = useState({
    uuid: currentUser?.uuid ? currentUser?.uuid : '',
    firstName: currentUser ? currentUser.firstName : '',
    lastName: currentUser ? currentUser.lastName : '',
    email: currentUser ? currentUser.email : '',
    permissions: currentUser ? currentUser.permissions : [],
  });

  useEffect(() => {
    if (!isLoading && users.length) {
      setCurrentUser(users[0]);
    }

    if (!isLoadingPermissions && permissions.length) {
      setCurrentPermission(permissions[0]);
    }
  }, [isLoading, isLoadingPermissions]);

  useEffect(() => {
    if (!isLoading && currentUser) {
      setUserState((currentState) => ({
        ...currentState,
        ...currentUser,
      }));
    }
  }, [currentUser, isLoading]);

  const onUserChangeHandler = (event: any) => {
    setCurrentUser(users.filter((t) => t.uuid === event.target.value)[0]);
  };
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setUserState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };
  const onPermissionChangeHandler = (event: any) => {
    setCurrentPermission(
      permissions.filter((t) => t.uuid === event.target.value)[0]
    );
  };
  const handleAddPermissionToUser = () => {
    if (currentUser?.uuid && currentPermission) {
      const hasPermission = currentUser.permissions?.find(
        (p) => p.permissionId === currentPermission.uuid
      );
      if (hasPermission) return;
      const updatedPermissions = currentUser.permissions || [];
      updatedPermissions.push({
        permissionId: currentPermission.uuid,
        userId: currentUser.uuid,
        permission: currentPermission,
      });
      updateUser({ user: { ...currentUser, permissions: updatedPermissions } });
      refetch();
    }
  };
  return !currentUser?.uuid ? (
    <pre>pending</pre>
  ) : (
    <>
      <LabelledSelect
        label={t('label.user')}
        disabled={false}
        name="userId"
        id="userId"
        value={currentUser.uuid}
        onChangeHandler={onUserChangeHandler}
        options={users}
      />
      <Heading as="h2" size="sm" mb="2" mt="5">
        {t('menu.personalData')}
      </Heading>
      <LabelledInput
        label="email"
        disabled={false}
        type="text"
        name="email"
        id="email"
        autoComplete="email"
        value={userState.email || ''}
        onChangeHandler={onChangeHandler}
      />
      <LabelledInput
        label={t('label.firstName')}
        disabled={false}
        type="text"
        name="firstName"
        id="firstName"
        autoComplete="given-name"
        value={userState.firstName || ''}
        onChangeHandler={onChangeHandler}
      />
      <LabelledInput
        id="lastName"
        disabled={false}
        type="text"
        name="lastName"
        autoComplete="family-name"
        value={userState.lastName}
        onChangeHandler={onChangeHandler}
        label={t('label.lastName')}
      />
      <Heading as="h2" size="sm" mb="2" mt="5">
        {t('label.currentPermissions')}
      </Heading>
      {userState?.permissions?.length ? (
        <List>
          {userState.permissions.map((t, i) => (
            <ListItem key={i}>
              <ListIcon as={RiArrowDropRightLine} />
              {t?.permission?.description}
            </ListItem>
          ))}
        </List>
      ) : (
        <p>no permissions so far!</p>
      )}
      {currentPermission && (
        <>
          <FormControl style={{ margin: '10px auto' }}>
            <Select
              name="team"
              value={currentPermission.uuid}
              onChange={onPermissionChangeHandler}
            >
              {permissions.map((t, i) => (
                <option key={i} value={t.uuid}>
                  {t.displayName}
                </option>
              ))}
            </Select>
            <FormLabel htmlFor="team">{t('label.newPermission')}:</FormLabel>
          </FormControl>
          <Button type="button" onClick={handleAddPermissionToUser}>
            Add
          </Button>
        </>
      )}
    </>
  );
};
