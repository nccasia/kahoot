import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Game } from '@modules/game/entities/game.entity';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { RoomStatus } from '../types/room.type';
import { QuestionRoomUser } from './question-room-user.entity';
import { RoomQuestion } from './room-question.entity';
import { RoomUser } from './room-user.entity';

@Entity(Table.Room)
export class Room extends AbstractEntity {
  @ApiProperty({ enum: RoomStatus, enumName: 'RoomStatus' })
  @IsNotEmpty()
  @IsEnum(RoomStatus)
  @Column({ enum: RoomStatus })
  status: RoomStatus;

  @ApiProperty()
  @IsString()
  @Column({ unique: true })
  code: string;

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

  @ManyToOne(() => Game, (game) => game.rooms, {
    nullable: false,
  })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @OneToMany(() => RoomUser, (roomUser) => roomUser.room)
  roomUsers: RoomUser[];

  @OneToMany(() => RoomQuestion, (roomQuestion) => roomQuestion.room)
  roomQuestions: RoomQuestion[];

  @OneToMany(
    () => QuestionRoomUser,
    (questionRoomUser) => questionRoomUser.room,
  )
  questionRoomUsers: QuestionRoomUser[];
}
