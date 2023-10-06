import { BgColor } from './Colors';
import { Room } from './Rooms';

interface Ressource {
  uuid: string;
  displayName: string;
  shortDescription: string;
  longDescription: string;
  bgColor: BgColor;
}

export interface EmployeeRessource extends Ressource {
  userId?: string;
  roomId?: string;
}

// Typeguard
export const isEmployeeRessource = (
  ressource: EmployeeRessource | Room
): ressource is EmployeeRessource => {
  return ressource.hasOwnProperty('bgColor');
};
