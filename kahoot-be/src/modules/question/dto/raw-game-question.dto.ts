import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Question } from '../entities/question.entity';
import { SingleChoiceGameAnswerOptions } from '../types';

export class RawGameQuestionDto extends PickType(Question, [
  'id',
  'mode',
  'time',
  'title',
  'image',
]) {
  @ApiProperty({ type: () => SingleChoiceGameAnswerOptions, isArray: true })
  @Expose()
  answerOptions: SingleChoiceGameAnswerOptions;
  @ApiProperty()
  @Expose()
  correctIndex: number;
  @ApiProperty()
  @Expose()
  startTime: Date;
  @ApiProperty()
  @Expose()
  endTime: Date;
}
