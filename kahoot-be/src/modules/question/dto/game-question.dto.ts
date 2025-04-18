import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Question } from '../entities/question.entity';
import {
  MultipleChoiceGameAnswerOptions,
  SingleChoiceGameAnswerOptions,
} from '../types';

export class GameQuestionDto extends PickType(Question, [
  'id',
  'mode',
  'time',
  'title',
  'image',
]) {
  @ApiProperty({ type: () => SingleChoiceGameAnswerOptions, isArray: true })
  @Expose()
  answerOptions?:
    | SingleChoiceGameAnswerOptions[]
    | MultipleChoiceGameAnswerOptions[]
    | undefined;
  @ApiProperty()
  @Expose()
  startTime: Date;
  @ApiProperty()
  @Expose()
  endTime: Date;
}
