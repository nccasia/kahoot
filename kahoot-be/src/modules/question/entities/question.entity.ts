import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Game } from '@modules/game/entities/game.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  AnswerOptionsDto,
  QuestionMode,
  SingleChoiceAnswerOptionsDto,
} from '../types';
import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RoomQuestion } from '@modules/room/entities/room-question.entity';
import { QuestionRoomUser } from '@modules/room/entities/question-room-user.entity';

@Entity(Table.Question)
export class Question extends AbstractEntity {
  @ApiProperty({ enum: () => QuestionMode })
  @IsEnum(QuestionMode)
  @IsNotEmpty()
  @Column({ enum: QuestionMode })
  mode: QuestionMode;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @Column()
  time: number;

  @ApiProperty({ type: () => SingleChoiceAnswerOptionsDto })
  @IsNotEmpty()
  @ValidateNested()
  // more type. like multiple choice ...
  @Type(() => SingleChoiceAnswerOptionsDto)
  @Column({ type: 'json' })
  answerOptions: AnswerOptionsDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @Column()
  gameId: string;

  // relations
  @ManyToOne(() => Game, (game) => game.questions, {
    nullable: false,
  })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @OneToMany(() => RoomQuestion, (roomQuestion) => roomQuestion.question)
  roomQuestions: RoomQuestion[];

  @OneToMany(
    () => QuestionRoomUser,
    (questionRoomUser) => questionRoomUser.question,
  )
  questionRoomUsers: QuestionRoomUser[];
}
