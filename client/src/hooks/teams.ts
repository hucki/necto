import {
  useQuery,
  QueryResult,
  MutationResultPair,
  useMutation,
  queryCache,
} from 'react-query';
import { client } from '../services/ApiClient';
import { Employee, Employee2Team, Team } from '../types/Employee';

export function useTeam(
  uuid: string
): QueryResult<Team> & { team: Team | undefined } {
  const teamQuery = useQuery(['team', uuid], async () => {
    return client<Team>(`teams/${uuid}`);
  });
  const team = teamQuery.data;
  return {
    team,
    ...teamQuery,
  };
}

export function useAllTeams(): QueryResult<Team[]> & { teams: Team[] } {
  const teamsQuery = useQuery('teams', async () => {
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

export function useAddEmployeeToTeam(): MutationResultPair<
  Employee2Team,
  Error,
  { employee2Team: Employee2Team },
  string
> {
  const addEmployeeToTeam = async ({
    employee2Team,
  }: {
    employee2Team: Employee2Team;
  }): Promise<Employee2Team> => {
    return client<Employee2Team>('employee2Team', { data: employee2Team });
  };
  return useMutation(addEmployeeToTeam, {
    onSuccess: () => {
      queryCache.invalidateQueries('emlpoyee2Team');
    },
  });
}
