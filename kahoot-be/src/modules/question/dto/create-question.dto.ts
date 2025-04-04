import { PickType } from '@nestjs/swagger';
import { Question } from '../entities/question.entity';

export class CreateQuestionDto extends PickType(Question, [
  'answerOptions',
  'answerText',
  'mode',
  'time',
  'title',
  'image',
]) {}
