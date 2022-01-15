import { BgColor } from './Colors';

export type Ressource = {
  id: number;
  displayName: string;
  shortDescription: string;
  longDescription: string;
  bgColor: BgColor;
  building?: number;
};
