import { useQuery, QueryResult } from 'react-query';
import { client } from '../services/ApiClient';
import { Building } from '../types/Rooms';

export function usebuilding(
  uuid: string
): QueryResult<Building> & { building: Building | undefined } {
  const buildingQuery = useQuery(['building', uuid], async () => {
    return client<Building>(`buildings/${uuid}`);
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
  const buildingsQuery = useQuery('buildings', async () => {
    return client<Building[]>('buildings');
  });

  const buildings = buildingsQuery.data ?? [];

  return {
    buildings,
    ...buildingsQuery,
  };
}
