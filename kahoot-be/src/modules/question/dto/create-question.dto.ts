import { PickType } from '@nestjs/swagger';
import { Question } from '../entities/question.entity';

export class CreateQuestionDto extends PickType(Question, [
  'gameId',
  'answerOptions',
  'mode',
  'time',
]) {}
