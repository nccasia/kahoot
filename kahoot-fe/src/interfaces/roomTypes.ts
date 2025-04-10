import { ICurrentUser } from "./authTypes";
import { IQuestionGame } from "./questionTypes";

export interface IRoom {
  id: string;
  code: string;
  gameId: string;
  status: string;
  isOwner: boolean;
  scheduledAt?: Date
  clanId?: string;
  channelIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IJoinRoomResponse {
  gameId: string;
  roomId: string;
  isOwner: boolean;
  members: ICurrentUser[];
  roomStatus: string;
}

export interface IUserRanking {
  correctRate: number;
  totalCorrect: number;
  totalPoint: number;
  totalWrong: number;
  userId: string;
  userName: string;
  avatar?: string;
}

export interface IUserPoint {
  currentQuestionPoint: number;
  totalPoint: number;
  isCorrect: boolean;
}

export interface ISubmitedAnswer {
  answerIndex: number;
  submitedAt: string;
  submitedQuestionId: string;
}

export interface IGetCurrentQuestionResponse {
  currentQuestion: IQuestionGame;
  submitedAnswer?: ISubmitedAnswer;
  lastTotalPoint?: number;
}
