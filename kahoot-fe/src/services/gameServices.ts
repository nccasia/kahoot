import { IAppResponseBase } from "@/interfaces/appTypes";
import { ICreateGameDTO, IGame } from "@/interfaces/gameTypes";
import axiosConfig from "@/utils/axios";

const createGame = async (game: ICreateGameDTO): Promise<IAppResponseBase<IGame>> => {
  const response: IAppResponseBase<IGame> = await axiosConfig.post("/games", game);
  return response;
};
const gameServices = {
  createGame,
};
export default gameServices;
