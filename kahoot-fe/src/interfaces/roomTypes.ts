import { IUser } from "./authTypes";

export interface IRoom {
  id: string;
  code: string;
  gameId: string;
  status: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IJoinRoomResponse {
  roomId: string;
  isOwner: boolean;
  members: IUser[];
}
