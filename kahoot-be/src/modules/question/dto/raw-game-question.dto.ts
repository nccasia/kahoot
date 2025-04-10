import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Question } from '../entities/question.entity';
import {
  MultipleChoiceGameAnswerOptions,
  SingleChoiceGameAnswerOptions,
} from '../types';

export class RawGameQuestionDto extends PickType(Question, [
  'id',
  'mode',
  'time',
  'title',
  'image',
]) {
  @ApiProperty({
    type: () => [
      SingleChoiceGameAnswerOptions,
      MultipleChoiceGameAnswerOptions,
    ],
    isArray: true,
  })
  @Expose()
  answerOptions?:
    | SingleChoiceGameAnswerOptions
    | MultipleChoiceGameAnswerOptions
    | undefined;

  @ApiProperty()
  @Expose()
  correctIndex?: number;
  @ApiProperty()
  @Expose()
  correctIndexes?: number[];
  @ApiProperty()
  @Expose()
  answerText?: string;
  @ApiProperty()
  @Expose()
  startTime: Date;
  @ApiProperty()
  @Expose()
  endTime: Date;
}
