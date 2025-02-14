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
