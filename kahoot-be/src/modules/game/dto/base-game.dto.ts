import { BaseRoomDto } from '@modules/room/dto/base-room.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { GameStatus } from '../types/game.type';

export class BaseGameDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  @IsEnum(GameStatus)
  status: GameStatus;

  @ApiProperty()
  @Expose()
  isOwner: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class CurrentGameDto extends BaseGameDto {
  @ApiProperty()
  @Expose()
  lastRoom: BaseRoomDto;
}
