import {
  useQuery,
  UseQueryResult,
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import {
  AddEmployeeToTeamVariables,
  Employee,
  Employee2Team,
  RemoveEmployeeToTeamVariables,
  Team,
  TeamEmployeeRelation,
} from '../types/Employee';

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

export function useTeamsOfEmployee(
  employeeId: Employee['uuid']
): UseQueryResult<TeamEmployeeRelation[]> & { teams: TeamEmployeeRelation[] } {
  const teamsQuery = useQuery(['teamsOfEmployee', employeeId], async () => {
    return client<TeamEmployeeRelation[]>(`employee2team/${employeeId}`);
  });

  const teams = teamsQuery.data || [];

  return {
    teams,
    ...teamsQuery,
  };
}

export function useAddEmployeeToTeam(): UseMutationResult<
  Employee2Team,
  Error,
  { employee2Team: AddEmployeeToTeamVariables },
  string
> {
  const queryClient = useQueryClient();
  const addEmployeeToTeam = async ({
    employee2Team,
  }: {
    employee2Team: AddEmployeeToTeamVariables;
  }): Promise<Employee2Team> => {
    return client<AddEmployeeToTeamVariables, Employee2Team>('employee2Team', {
      data: employee2Team,
    });
  };
  return useMutation(addEmployeeToTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        'employee2Team',
        'employees',
        'employees/all',
        'teamsOfEmployee',
      ]);
    },
  });
}

export function useRemoveEmployeeFromTeam(): UseMutationResult<
  string,
  Error,
  { employee2Team: RemoveEmployeeToTeamVariables },
  string
> {
  const queryClient = useQueryClient();
  const addEmployeeToTeam = async ({
    employee2Team,
  }: {
    employee2Team: RemoveEmployeeToTeamVariables;
  }): Promise<string> => {
    return client<RemoveEmployeeToTeamVariables, string>('employee2Team', {
      data: employee2Team,
      method: 'DELETE',
    });
  };
  return useMutation(addEmployeeToTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        'employee2Team',
        'employees',
        'employees/all',
        'teamsOfEmployee',
      ]);
    },
  });
}
