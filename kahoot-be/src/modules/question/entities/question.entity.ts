import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Game } from '@modules/game/entities/game.entity';
import { QuestionRoomUser } from '@modules/room/entities/question-room-user.entity';
import { RoomQuestion } from '@modules/room/entities/room-question.entity';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  AnswerOptionsDto,
  MultipleChoiceAnswerOptionsDto,
  QuestionMode,
  SingleChoiceAnswerOptionsDto,
} from '../types';

@Entity(Table.Question)
export class Question extends AbstractEntity {
  @ApiProperty({ enum: QuestionMode, enumName: 'QuestionMode' })
  @IsEnum(QuestionMode)
  @IsNotEmpty()
  @Expose()
  @Column({ enum: QuestionMode })
  mode: QuestionMode;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @Expose()
  @Column()
  time: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Column()
  title: string;

  @ApiProperty({ nullable: true })
  @Expose()
  @Column({ nullable: true })
  image: string;

  @ApiProperty({
    type: () => SingleChoiceAnswerOptionsDto,
    nullable: true,
  })
  @ValidateNested({ each: true })
  // more type. like multiple choice ...
  @Type(() => SingleChoiceAnswerOptionsDto)
  @Type(() => MultipleChoiceAnswerOptionsDto)
  @Column({ type: 'json', nullable: true })
  answerOptions?: AnswerOptionsDto;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.mode === QuestionMode.Text)
  @Expose()
  @Column({ nullable: true })
  answerText?: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Column()
  ownerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @Column()
  gameId: string;

  // relations
  @ManyToOne(() => User, (user) => user.games, {
    nullable: false,
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

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
