import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Question } from '@modules/question/entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

@Index(['room', 'user', 'question'], { unique: true })
@Entity(Table.QuestionRoomUser)
export class QuestionRoomUser extends AbstractEntity {
  @Column({ nullable: false, name: 'room_id' })
  roomId: string;

  @Column({ nullable: false, name: 'question_id' })
  questionId: string;

  @Column({ nullable: false, name: 'user_id' })
  userId: string;

  // relations
  @ManyToOne(() => Room, (room) => room.questionRoomUsers, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Question, (question) => question.questionRoomUsers, {
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => User, (user) => user.questionRoomUsers, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
