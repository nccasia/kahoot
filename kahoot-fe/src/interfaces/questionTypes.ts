export interface IAnswerOption {
  options: string[];
  correctIndex: number | null;
  correctIndexes: number[] | null;
  // answerText?: string;
}
export interface IQuestion {
  id?: string;
  mode: string;
  title: string;
  time: number;
  ownerId?: string;
  gameId?: string;
  answerOptions: IAnswerOption;
  answerText?: string;
  isError?: boolean;
  imageFile?: File;
  image?: string;
}

export interface IAddQuestionToGameDTO {
  mode: string;
  time: number;
  title: string;
  answerOptions: IAnswerOption;
  answerText?: string;
  imageFile?: File | null;
  image?: string | null;
}

export interface IQuestionGame {
  id: string;
  title: string;
  time: number;
  startTime: string;
  endTime: string;
  mode: string;
  answerOptions: IAnswerOption;
  order?: number;
  imageFile?: File | null;
  image?: string | null;
}

export interface ISendAnswerDTO {
  roomId: string;
  questionId: string;
  answerIndex: number;
}

export interface IQuestionAnalyst {
  answerIndex: number;
  totalSeleted: number;
}

export interface IGetCorrectAnswerResponse {
  questionId: string;
  correctIndex: number;
  questionAnalysis: IQuestionAnalyst[];
}
