import { IAppResponseBase } from "@/interfaces/appTypes";
import { IAddQuestionToGameDTO, IQuestion } from "@/interfaces/questionTypes";
import axiosConfig from "@/utils/axios";
const addQuestion = async (gameId: string, questions: IAddQuestionToGameDTO[]): Promise<IAppResponseBase<IQuestion[]>> => {
  console.log('====================================');
  console.log(gameId);
  console.log('====================================');
  const response: IAppResponseBase<IQuestion[]> = await axiosConfig.post(`/questions/add-questions/${gameId}`, questions);
  return response;
};
const getGameQuestion = async (
  gameId: string,
  page: number,
  limit: number,
  search: string
): Promise<IAppResponseBase<IQuestion[]>> => {
  const response: IAppResponseBase<IQuestion[]> = await axiosConfig.get(
    `/questions/game-questions/${gameId}?page=${page}&limit=${limit}&search=${search}`
  );
  return response;
};
const getQuestionById = async (questionId: string): Promise<IAppResponseBase<IQuestion>> => {
  const response: IAppResponseBase<IQuestion> = await axiosConfig.get(`/questions/${questionId}`);
  return response;
};
const updateQuestion = async (question: IQuestion): Promise<IAppResponseBase<IQuestion>> => {
  const response: IAppResponseBase<IQuestion> = await axiosConfig.put(`/questions/${question.id}`, question);
  return response;
};
const deleteQuestion = async (questionId: string): Promise<IAppResponseBase<IQuestion>> => {
  const response: IAppResponseBase<IQuestion> = await axiosConfig.delete(`/questions/${questionId}`);
  return response;
};
const questionServices = {
  addQuestion,
  getGameQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
export default questionServices;
