import { User, TeamMember } from '../types/User';
import { UserSettings, Contract } from '../types/UserSettings';

interface User2TeamMemberAttributes {
  user: User;
  userSettings: UserSettings;
  contract: Contract;
}

export function user2TeamMember({
  user,
  userSettings,
  contract,
}: User2TeamMemberAttributes): TeamMember | undefined {
  if (!user.id) return;
  const teamMember: TeamMember = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    appointmentsPerWeek: contract.appointmentsPerWeek,
    color: userSettings.bgColor,
    planningProgress: 0,
  };
  return teamMember;
}
