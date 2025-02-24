export interface IAnswerOption {
  options: string[];
  correctIndex: number | null;
}
export interface IQuestion {
  id?: string;
  mode: string;
  title: string;
  time: number;
  ownerId?: string;
  gameId?: string;
  answerOptions: IAnswerOption;
  isError?: boolean;
}

export interface IAddQuestionToGameDTO {
  mode: string;
  time: number;
  title: string;
  answerOptions: IAnswerOption;
}

export interface IQuestionGame {
  id: string;
  title: string;
  time: number;
  startTime: string;
  endTime: string;
  mode: string;
  answerOptions: IAnswerOption;
}

export interface ISendAnswerDTO {
  roomId: string;
  questionId: string;
  answerIndex: number;
}

export interface IQuestionAnalyst {
  answerIndex: string;
  totalSeleted: number;
}

export interface IGetCorrectAnswerResponse {
  questionId: string;
  correctIndex: number;
  questionAnalysis: IQuestionAnalyst[];
}
