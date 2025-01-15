import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Question } from '@modules/question/entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GameStatus } from '../types/game.type';
import { Room } from '@modules/room/entities/room.entity';

@Entity(Table.Game)
export class Game extends AbstractEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  description: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Column()
  ownerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(() => GameStatus)
  status: GameStatus;

  // relations
  @ManyToOne(() => User, (user) => user.games, {
    nullable: false,
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Question, (question) => question.game)
  questions: Question[];

  @OneToMany(() => Room, (room) => room.game)
  rooms: Room[];
}
