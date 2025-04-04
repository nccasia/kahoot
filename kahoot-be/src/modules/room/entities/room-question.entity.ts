import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Question } from '@modules/question/entities/question.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Room } from './room.entity';

@Entity(Table.RoomQuestion)
@Index(['room', 'question'], { unique: true })
export class RoomQuestion extends AbstractEntity {
  @Column({ nullable: false, name: 'room_id' })
  roomId: string;

  @Column({ nullable: false, name: 'question_id' })
  questionId: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  startTime: Date;

  // End time = Start time + Question time
  // This is a calculated field
  @ApiProperty()
  @Column({ type: 'timestamptz' })
  endTime: Date;

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
