import {
  MultipleChoiceAnswerOptionsDto,
  SingleChoiceAnswerOptionsDto,
} from './question.dto';

export enum QuestionMode {
  SingleChoice = 'single_choice',
  MultipleChoice = 'multiple_choice',
  Text = 'text',
}

// more type. like multiple choice ...
export type AnswerOptionsDto =
  | SingleChoiceAnswerOptionsDto
  | MultipleChoiceAnswerOptionsDto
  | undefined;
