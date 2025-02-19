import { IRoom } from "./roomTypes";

export interface IGame {
  id: string;
  name: string;
  description: string;
  status: string;
  isOwner: boolean;
  lastRoom: IRoom | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateGameDTO {
  name: string;
  description?: string;
  status: string;
}
