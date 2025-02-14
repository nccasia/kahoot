import { IAppResponseBase } from "@/interfaces/appTypes";
import { IAddQuestionToGameDTO, IQuestion } from "@/interfaces/questionTypes";
import axiosConfig from "@/utils/axios";
const addQuestion = async (gameId: string, questions: IAddQuestionToGameDTO[]): Promise<IAppResponseBase<IQuestion[]>> => {
  const response: IAppResponseBase<IQuestion[]> = await axiosConfig.post(`/questions/add-questions/${gameId}`, questions);
  return response;
};
const questionServices = {
  addQuestion,
};
export default questionServices;
