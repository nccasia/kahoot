import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Game } from '@modules/game/entities/game.entity';
import { QuestionRoomUser } from '@modules/room/entities/question-room-user.entity';
import { RoomUser } from '@modules/room/entities/room-user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Index(['email'], { unique: true })
@Entity(Table.User)
export class User extends AbstractEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ unique: true })
  mezonUserId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ unique: true })
  userName: string;

  @ApiProperty()
  @IsString()
  @Column({
    nullable: true,
  })
  avatar: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column()
  email: string;

  // relations
  @OneToMany(() => Game, (game) => game.owner)
  games: Game[];

  @ApiProperty({ type: () => [RoomUser] })
  @OneToMany(() => RoomUser, (roomUser) => roomUser.user)
  roomUsers: RoomUser[];

  @OneToMany(
    () => QuestionRoomUser,
    (questionRoomUser) => questionRoomUser.user,
  )
  questionRoomUsers: QuestionRoomUser[];
}
