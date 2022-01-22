import dayjs, { Dayjs } from 'dayjs';
import { useQuery, QueryResult } from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Building } from '../types/Rooms';

export function usebuilding(
  uuid: string
): QueryResult<Building> & { building: Building | undefined } {
  const client = useAuthenticatedClient<Building>();
  const buildingQuery = useQuery(['building', uuid], async () => {
    return client(`buildings/${uuid}`);
  });
  const building = buildingQuery.data;
  return {
    building,
    ...buildingQuery,
  };
}

export function useAllbuildings(): QueryResult<Building[]> & {
  buildings: Building[];
  } {
  const client = useAuthenticatedClient<Building[]>();

  const buildingsQuery = useQuery('buildings', async () => {
    return client('buildings');
  });

  const buildings = buildingsQuery.data ?? [];

  return {
    buildings,
    ...buildingsQuery,
  };
}
