import { BgColor } from './Colors';

interface Ressource {
  uuid: string;
  displayName: string;
  shortDescription: string;
  longDescription: string;
  bgColor: BgColor;
}

export interface EmployeeRessource extends Ressource {
  userId?: string;
}
