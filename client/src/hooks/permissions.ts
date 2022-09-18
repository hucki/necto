import { useQuery, QueryResult } from 'react-query';
import { client } from '../services/ApiClient';
import { PermissionLevel } from '../types/UserSettings';

export function useAllPermissions(): QueryResult<PermissionLevel[]> & {
  permissions: PermissionLevel[];
} {
  const permissionsQuery = useQuery('settings/permissions', async () => {
    return client<PermissionLevel[]>('settings/permissions');
  });

  const permissions = permissionsQuery.data ?? [];

  return {
    permissions,
    ...permissionsQuery,
  };
}
