import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Game } from '@modules/game/entities/game.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RoomUser } from '@modules/room/entities/room-user.entity';
import { QuestionRoomUser } from '@modules/room/entities/question-room-user.entity';

@Index(['email'], { unique: true })
@Entity(Table.User)
export class User extends AbstractEntity {
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
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column()
  email: string;

  @IsNotEmpty()
  @Column()
  hashedPassword: string;
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
