import {
  useQuery,
  UseQueryResult,
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Employee, Employee2Team, Team } from '../types/Employee';

export function useTeam(
  uuid: string
): UseQueryResult<Team> & { team: Team | undefined } {
  const teamQuery = useQuery(['team', uuid], async () => {
    return client<Team>(`teams/${uuid}`);
  });
  const team = teamQuery.data;
  return {
    team,
    ...teamQuery,
  };
}

export function useAllTeams(): UseQueryResult<Team[]> & { teams: Team[] } {
  const teamsQuery = useQuery(['teams'], async () => {
    return client<Team[]>('teams');
  });

  const teams =
    teamsQuery.data?.sort(
      (a, b) => parseInt(a.displayName) - parseInt(b.displayName)
    ) ?? [];

  return {
    teams,
    ...teamsQuery,
  };
}

export function useAddEmployeeToTeam(): UseMutationResult<
  Employee2Team,
  Error,
  { employee2Team: Employee2Team },
  string
> {
  const queryClient = useQueryClient();
  const addEmployeeToTeam = async ({
    employee2Team,
  }: {
    employee2Team: Employee2Team;
  }): Promise<Employee2Team> => {
    return client<Employee2Team>('employee2Team', { data: employee2Team });
  };
  return useMutation(addEmployeeToTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries(['emlpoyee2Team']);
    },
  });
}
