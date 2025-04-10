import { Expose } from 'class-transformer';
import { QuestionRoomUser } from '../entities/question-room-user.entity';

export class UserAnswerDto extends QuestionRoomUser {
  @Expose()
  questionMode: string;
  @Expose()
  userName: string;
  @Expose()
  avatar?: string;
}
