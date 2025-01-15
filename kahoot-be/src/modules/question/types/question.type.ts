import { SingleChoiceAnswerOptionsDto } from './question.dto';

export enum QuestionMode {
  SingleChoice = 'single_choice',
}

// more type. like multiple choice ...
export type AnswerOptionsDto = SingleChoiceAnswerOptionsDto;
