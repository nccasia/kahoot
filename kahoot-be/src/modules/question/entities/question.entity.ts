import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Game } from '@modules/game/entities/game.entity';
import { QuestionRoomUser } from '@modules/room/entities/question-room-user.entity';
import { RoomQuestion } from '@modules/room/entities/room-question.entity';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsUrl,
  IsUUID,
  ValidateIf,
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

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @ValidateIf((o) => {
    return o?.image !== undefined && o?.image !== null;
  })
  @IsUrl()
  @Column({ nullable: true })
  image: string;

  @ApiProperty({
    type: () => SingleChoiceAnswerOptionsDto,
    nullable: true,
  })
  @ValidateIf(
    (o) =>
      o?.mode === QuestionMode.SingleChoice ||
      o?.mode === QuestionMode.MultipleChoice,
  )
  @Type((o) => {
    return o?.object?.mode === QuestionMode.SingleChoice
      ? SingleChoiceAnswerOptionsDto
      : MultipleChoiceAnswerOptionsDto;
  })
  @Column({ type: 'json', nullable: true })
  answerOptions?: AnswerOptionsDto;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o?.mode === QuestionMode.Text)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
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
