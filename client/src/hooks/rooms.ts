import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Room } from '../types/Rooms';

export function useRoom(
  uuid: string
): UseQueryResult<Room> & { room: Room | undefined } {
  const roomQuery = useQuery(['room', uuid], async () => {
    return client<Room>(`rooms/${uuid}`);
  });
  const room = roomQuery.data;
  return {
    room,
    ...roomQuery,
  };
}

export function useAllRooms(): UseQueryResult<Room[]> & { rooms: Room[] } {
  const roomsQuery = useQuery(['rooms'], async () => {
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
