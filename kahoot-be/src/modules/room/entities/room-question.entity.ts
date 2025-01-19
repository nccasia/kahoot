import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Room } from './room.entity';
import { Question } from '@modules/question/entities/question.entity';

@Entity(Table.RoomQuestion)
@Index(['room', 'question'], { unique: true })
export class RoomQuestion extends AbstractEntity {
  @Column({ nullable: false, name: 'room_id' })
  roomId: string;

  @Column({ nullable: false, name: 'question_id' })
  questionId: string;

  // relations
  @ManyToOne(() => Room, (room) => room.roomQuestions, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Question, (question) => question.roomQuestions, {
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
