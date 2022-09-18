import { useQuery, QueryResult } from 'react-query';
import { client } from '../services/ApiClient';
import { Room } from '../types/Ressource';

export function useRoom(
  uuid: string
): QueryResult<Room> & { room: Room | undefined } {
  const roomQuery = useQuery(['room', uuid], async () => {
    return client<Room>(`rooms/${uuid}`);
  });
  const room = roomQuery.data;
  return {
    room,
    ...roomQuery,
  };
}

export function useAllRooms(): QueryResult<Room[]> & { rooms: Room[] } {
  const roomsQuery = useQuery('rooms', async () => {
    return client<Room[]>('rooms');
  });

  const rooms =
    roomsQuery.data?.sort(
      (a, b) => parseInt(a.displayName) - parseInt(b.displayName)
    ) ?? [];

  return {
    rooms,
    ...roomsQuery,
  };
}
