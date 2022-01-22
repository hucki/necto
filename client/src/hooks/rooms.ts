import dayjs, { Dayjs } from 'dayjs';
import { useQuery, QueryResult } from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Room } from '../types/Ressource';

export function useRoom(
  uuid: string
): QueryResult<Room> & { room: Room | undefined } {
  const client = useAuthenticatedClient<Room>();
  const roomQuery = useQuery(['room', uuid], async () => {
    return client(`rooms/${uuid}`);
  });
  const room = roomQuery.data;
  return {
    room,
    ...roomQuery,
  };
}

export function useAllRooms(): QueryResult<Room[]> & { rooms: Room[] } {
  const client = useAuthenticatedClient<Room[]>();

  const roomsQuery = useQuery('rooms', async () => {
    return client('rooms');
  });

  const rooms = roomsQuery.data ?? [];

  return {
    rooms,
    ...roomsQuery,
  };
}
