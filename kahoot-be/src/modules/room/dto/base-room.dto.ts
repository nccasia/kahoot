import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { RoomStatus } from '../types';

export class BaseRoomDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  gameId: string;

  @ApiProperty()
  @Expose()
  @IsEnum(RoomStatus)
  status: RoomStatus;

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
