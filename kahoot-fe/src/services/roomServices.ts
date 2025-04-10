import { IAppResponseBase } from "@/interfaces/appTypes";
import { IRoom } from "@/interfaces/roomTypes";
import axiosConfig from "@/utils/axios";

const createRoom = async (gameId: string): Promise<IAppResponseBase<IRoom>> => {
  // Call the API to create a room
  const response: IAppResponseBase<IRoom> = await axiosConfig.post(`/rooms`, { gameId });
  return response;
};

const getRoomOfGame = async (gameId: string, page: number, limit: number, search: string): Promise<IAppResponseBase<IRoom[]>> => {
  const response: IAppResponseBase<IRoom[]> = await axiosConfig.get(
    `/rooms/game-rooms/${gameId}?page=${page}&limit=${limit}&search=${search}`
  );
  return response;
};

const getRoomById = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.get(`/rooms/${roomId}`);
  return response;
};

const deleteRoom = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.delete(`/rooms/${roomId}`);
  return response;
};

const startGame = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.put(`/rooms/start-game/${roomId}`);
  return response;
};

const roomServices = {
  // add other functions here to export
  createRoom,
  getRoomOfGame,
  getRoomById,
  deleteRoom,
  startGame,
};
export default roomServices;
