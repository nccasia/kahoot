import { IAppResponseBase } from "@/interfaces/appTypes";
import { ICreateScheduleRoom, IRoom } from "@/interfaces/roomTypes";
import axiosConfig from "@/utils/axios";

const createRoom = async (gameId: string): Promise<IAppResponseBase<IRoom>> => {
  // Call the API to create a room
  const response: IAppResponseBase<IRoom> = await axiosConfig.post(`/rooms`, { gameId });
  return response;
};

const getRoomOfGame = async (gameId: string, page: number, limit: number, search?: string, sort?: Record<string, 'desc' | 'asc'>): Promise<IAppResponseBase<IRoom[]>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search : search ? search : "",
    sort: sort ? JSON.stringify(sort) : "",
  });

  const response: IAppResponseBase<IRoom[]> = await axiosConfig.get(
    `/rooms/game-rooms/${gameId}?${params.toString()}`
  );
  return response;
};

const getRoomById = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.get(`/rooms/${roomId}`);
  return response;
};

const createScheduleRoom = async (gameId: string, scheduleData: ICreateScheduleRoom): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.post(`/rooms/create-schedule`, {
    gameId,
    ...scheduleData,
  });
  return response;
}

const getScheduledRoom = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.get(`/rooms/scheduled-rooms/${roomId}`);
  return response;
}

const updateScheduledRoom = async (roomId: string, scheduleData: ICreateScheduleRoom): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.put(`/rooms/update-schedule/${roomId}`, scheduleData);
  return response;
}

const cancelScheduledRoom = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.put(`/rooms/cancel-schedule/${roomId}`);
  return response;
}
const deleteRoom = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.delete(`/rooms/${roomId}`);
  return response;
};

const startGame = async (roomId: string): Promise<IAppResponseBase<IRoom>> => {
  const response: IAppResponseBase<IRoom> = await axiosConfig.put(`/rooms/start-game/${roomId}`);
  return response;
};

const roomServices = {
  createRoom,
  createScheduleRoom,
  getScheduledRoom,
  updateScheduledRoom,
  cancelScheduledRoom,
  getRoomOfGame,
  getRoomById,
  deleteRoom,
  startGame,
};
export default roomServices;
