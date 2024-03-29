import { Box, Tag, TagLeftIcon, VStack } from '@chakra-ui/react';
import React from 'react';
import { CgAdd, CgBlock } from 'react-icons/cg';
import { MinimalUser, Role } from '../../../types/Auth';
import { User } from '../../../types/User';
import { IconButton } from '../../atoms/Buttons';

const minimizeUser = (
  user: User & { uuid: string; email: string }
): MinimalUser => {
  return {
    uuid: user.uuid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.permissions
      ? user.permissions.map((p) => (p.permission?.displayName as Role) || '')
      : [],
  };
};
type ListItemProps = {
  user: MinimalUser;
};

const ListItem = ({ user }: ListItemProps) => {
  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="auto auto 42px"
        gridTemplateAreas="user tags controls"
        justifyItems="stretch"
        p="1"
        width="100%"
        border="1px solid #3333"
        borderRadius="0.5rem"
        paddingLeft="0.5rem"
      >
        <div className="user-data">
          {user.email}, {user.lastName}, {user.firstName}
        </div>
        <div
          className="tags"
          style={{
            justifySelf: 'right',
            alignSelf: 'center',
            marginRight: '1rem',
          }}
        >
          <Tag
            size="sm"
            variant={
              user.roles?.find((role) => role === 'employee')
                ? 'solid'
                : undefined
            }
            colorScheme={
              user.roles?.find((role) => role === 'employee') ? 'teal' : 'gray'
            }
          >
            {!user.roles?.find((role) => role === 'employee') && (
              <TagLeftIcon as={CgAdd} />
            )}
            Employee
          </Tag>
          <Tag
            size="sm"
            variant={
              user.roles?.find((role) => role === 'planner')
                ? 'solid'
                : undefined
            }
            colorScheme={
              user.roles?.find((role) => role === 'planner') ? 'teal' : 'gray'
            }
          >
            {!user.roles?.find((role) => role === 'planner') && (
              <TagLeftIcon as={CgAdd} />
            )}
            Planner
          </Tag>
          <Tag
            size="sm"
            variant={
              user.roles?.find((role) => role === 'admin') ? 'solid' : undefined
            }
            colorScheme={
              user.roles?.find((role) => role === 'admin') ? 'teal' : 'gray'
            }
          >
            {!user.roles?.find((role) => role === 'admin') && (
              <TagLeftIcon as={CgAdd} />
            )}
            Admin
          </Tag>
        </div>
        <div
          className="controls"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            size="sm"
            aria-label="block user"
            colorScheme="red"
            icon={<CgBlock size="2rem" />}
          />
        </div>
      </Box>
    </>
  );
};

interface NewUserPanelProps {
  newUsers: User[];
}
const NewUserPanel = ({ newUsers }: NewUserPanelProps) => {
  const usersList = newUsers.map((user) => (
    <ListItem
      key={user.uuid}
      user={minimizeUser(user as User & { uuid: string; email: string })}
    />
  ));

  return (
    <>
      <div className="user-wrapper">
        <VStack>{usersList}</VStack>
      </div>
    </>
  );
};

export default NewUserPanel;
