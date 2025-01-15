import { Game } from '@modules/game/entities/game.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoomStatus } from '../types/room.type';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';

@Entity(Table.Room)
export class Room extends AbstractEntity {
  @ApiProperty({ enum: () => RoomStatus })
  @IsNotEmpty()
  @IsEnum(() => RoomStatus)
  @Column({ enum: RoomStatus })
  status: RoomStatus;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @Column()
  gameId: string;

  // relations
  @ManyToOne(() => Game, (game) => game.rooms, {
    nullable: false,
  })
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
