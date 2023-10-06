import { Event } from './Event';

export interface APIData {
  type: string;
  attributes: Event;
}
export interface APIResponse {
  data: APIData[];
  jsonapi: {
    version: string;
  };
}
