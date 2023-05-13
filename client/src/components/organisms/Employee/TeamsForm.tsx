import React, { useEffect, useState } from 'react';
import {
  AddEmployeeToTeamVariables,
  Employee,
  Team,
} from '../../../types/Employee';
import { Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import { ControlWrapper } from '../../atoms/Wrapper';
import { FormControl, FormLabel, Select } from '../../Library';
import { IconButton } from '../../atoms/Buttons';
import {
  useAddEmployeeToTeam,
  useAllTeams,
  useRemoveEmployeeFromTeam,
  useTeamsOfEmployee,
} from '../../../hooks/teams';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTimes } from 'react-icons/fa';

type TeamsFormProps = {
  employeeId: Employee['uuid'];
  isReadOnly: boolean;
};
export const TeamsForm = ({
  employeeId,
  isReadOnly = true,
}: TeamsFormProps) => {
  const { t } = useTranslation();
  const { mutateAsync: removeFromTeam } = useRemoveEmployeeFromTeam();
  const { isLoading: isLoadingTeams, teams } = useAllTeams();
  const { teams: teamsOfEmployee, refetch } = useTeamsOfEmployee(employeeId);
  const { mutateAsync: addEmployeeToTeam, status: addEmployeeToTeamStatus } =
    useAddEmployeeToTeam();

  const selectableTeams = !teamsOfEmployee.length
    ? teams
    : teams.filter((t) => !teamsOfEmployee?.find((et) => et.teamId === t.uuid));

  const appointedTeams = teams.filter((t) =>
    teamsOfEmployee.map((t) => t.teamId).includes(t.uuid)
  );

  const [selectedTeamId, setSelectedTeamId] = useState<
    Team['uuid'] | undefined
  >();

  useEffect(() => {
    if (!isLoadingTeams && selectableTeams.length) {
      setSelectedTeamId(selectableTeams[0].uuid);
    }
  }, [isLoadingTeams, selectableTeams]);

  const onTeamChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamId(event.target.value);
  };

  const handleRemoveEmployeeFromTeam = (teamId: Team['uuid']) => {
    removeFromTeam({
      employee2Team: { employeeId, teamId },
    }).finally(() => refetch());
  };

  const handleAddEmployeeToTeam = () => {
    if (selectedTeamId) {
      const employee2Team: AddEmployeeToTeamVariables = {
        employeeId: employeeId,
        teamId: selectedTeamId,
      };
      addEmployeeToTeam({ employee2Team }).finally(() => refetch());
    }
  };
  const selectTeamIsDisabled =
    isReadOnly || addEmployeeToTeamStatus === 'loading';

  return (
    <>
      {appointedTeams?.length ? (
        <>
          <Heading as="h3" size="sm" mb="2" mt="5">
            {t('label.currentTeams')}
          </Heading>
          <List style={{ marginBottom: '10px' }}>
            {appointedTeams.map((t, i) => (
              <ListItem key={i}>
                <ListIcon as={RiArrowDropRightLine} />
                {t.displayName}
                <IconButton
                  aria-label="remove employee from team"
                  icon={<FaTimes />}
                  variant="ghost"
                  alignSelf="center"
                  type="button"
                  onClick={() => handleRemoveEmployeeFromTeam(t.uuid)}
                  isDisabled={isReadOnly}
                  colorScheme="orange"
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <span>{t('warning.employeeSettings.noTeamSelected')}</span>
      )}
      {selectableTeams.length > 0 && (
        <ControlWrapper>
          <FormControl id="team" m={'15px auto 10px auto'}>
            <Select
              name="team"
              value={selectedTeamId}
              onChange={onTeamChangeHandler}
              isDisabled={selectTeamIsDisabled}
            >
              {selectableTeams.map((t, i) => (
                <option key={i} value={t.uuid}>
                  {t.displayName}
                </option>
              ))}
            </Select>
            <FormLabel>team to add to:</FormLabel>
          </FormControl>
          <IconButton
            aria-label="add employee to team"
            icon={<FaPlus />}
            alignSelf="center"
            type="button"
            onClick={handleAddEmployeeToTeam}
            isDisabled={selectTeamIsDisabled}
            colorScheme="green"
          />
        </ControlWrapper>
      )}
    </>
  );
};
