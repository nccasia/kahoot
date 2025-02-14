import { IAppResponseBase } from "@/interfaces/appTypes";
import { ICreateGameDTO, IGame } from "@/interfaces/gameTypes";
import axiosConfig from "@/utils/axios";

const createGame = async (game: ICreateGameDTO): Promise<IAppResponseBase<IGame>> => {
  const response: IAppResponseBase<IGame> = await axiosConfig.post("/games", game);
  return response;
};

const getListGame = async (page: number, limit: number, search: string): Promise<IAppResponseBase<IGame[]>> => {
  const response: IAppResponseBase<IGame[]> = await axiosConfig.get(`/games?page=${page}&limit=${limit}&search=${search}`);
  return response;
};

const getGameById = async (id: string): Promise<IAppResponseBase<IGame>> => {
  const response: IAppResponseBase<IGame> = await axiosConfig.get(`/games/${id}`);
  return response;
};

const updateGame = async (id: string, game: ICreateGameDTO): Promise<IAppResponseBase<IGame>> => {
  const response: IAppResponseBase<IGame> = await axiosConfig.put(`/games/${id}`, game);
  return response;
};

const deleteGame = async (id: string): Promise<IAppResponseBase<IGame>> => {
  const response: IAppResponseBase<IGame> = await axiosConfig.delete(`/games/${id}`);
  return response;
};

const gameServices = {
  createGame,
  getListGame,
  getGameById,
  updateGame,
  deleteGame,
};
export default gameServices;
