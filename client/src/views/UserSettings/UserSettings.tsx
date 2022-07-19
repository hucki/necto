import { Heading, Input, List, ListIcon, ListItem, Select } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { Button, FormGroup, Label } from '../../components/Library';
import { useAllPermissions } from '../../hooks/permissions';
import { useAllUsers, useUpdateUser } from '../../hooks/user';
import { User } from '../../types/User';
import { PermissionLevel } from '../../types/UserSettings';

export const UserSettings = () => {
  const [updateUser] = useUpdateUser();
  const {
    isLoading,
    error,
    users,
    refetch
  } = useAllUsers();
  const {
    isLoading: isLoadingPermissions,
    error: permissionsError,
    permissions,
  } = useAllPermissions();
  const [currentUser, setCurrentUser] = useState<
    User | undefined
  >();
  const [currentPermission, setCurrentPermission] = useState<PermissionLevel | undefined>();
  const [userState, setUserState] = useState({
    uuid: currentUser?.uuid ? currentUser?.uuid: '',
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
    if ( !isLoading && currentUser ) {
      setUserState((currentState) => ({
        ...currentState,
        ...currentUser,
      }));
    }
  }, [currentUser, isLoading]);

  const onUserChangeHandler = (event: any) => {
    setCurrentUser(
      users.filter((t) => t.uuid === event.target.value)[0]
    );
  };
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setUserState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };
  const onPermissionChangeHandler = (event: any) => {
    setCurrentPermission(permissions.filter((t) => t.uuid === event.target.value)[0]);
  };
  const handleAddPermissionToUser = () => {
    if (currentUser?.uuid && currentPermission) {
      const hasPermission = currentUser.permissions?.find(p => p.permissionId === currentPermission.uuid);
      if (hasPermission) return;
      const updatedPermissions = currentUser.permissions || [];
      updatedPermissions.push({
        permissionId: currentPermission.uuid,
        userId: currentUser.uuid,
        permission: currentPermission,
      });
      updateUser({user: {...currentUser, permissions: updatedPermissions}});
      refetch();
    }

  };
  return !currentUser
    ? <pre>pending</pre>
    : (
      <>
        <FormGroup>
          <Label htmlFor="user">User</Label>
          <Select
            name="userId"
            value={currentUser.uuid}
            onChange={onUserChangeHandler}
          >
            {users
              .map((u, i) => (
                <option key={i} value={u.uuid}>
                  {u.lastName + ', ' + u.firstName}
                </option>
              ))}
          </Select>
        </FormGroup>
        <Heading as='h2' size='sm' mb="2">Personal Data</Heading>
        <FormGroup>
          <Label htmlFor="email">email</Label>
          <Input
            type="text"
            name="email"
            autoComplete="email"
            value={userState.email}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={userState.firstName}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            autoComplete="family-name"
            value={userState.lastName}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <Heading as='h2' size='sm' mb="2">current Permissions</Heading>
        {
          userState?.permissions?.length
            ? <List>
              {userState.permissions.map((t, i) => (
                <ListItem key={i}>
                  <ListIcon as={RiArrowDropRightLine}/>
                  {t?.permission?.description}
                </ListItem>
              ))}
            </List>
            : <p>no permissions so far!</p>
        }
        {currentPermission && (
          <FormGroup>
            <Label htmlFor="team">new permission:</Label>
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
          </FormGroup>
        )}
        <Button type="button" onClick={handleAddPermissionToUser}>
          Add
        </Button>

      </>
    );
};
