import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Room } from '../entities/room.entity';

export class CreateRoomDto extends PickType(Room, ['gameId']) {}
export class CreateScheduleRoomDto extends CreateRoomDto {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @Expose()
  scheduledAt: Date;
  @ApiProperty({ type: String })
  @Expose()
  clanId: string;
  @ApiProperty({ type: String, isArray: true })
  @Expose()
  channelIds?: string[];
}

export class UpdateScheduleRoomDto {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @Expose()
  scheduledAt: Date;
  @ApiProperty({ type: String })
  @Expose()
  clanId: string;
  @ApiProperty({ type: String, isArray: true })
  @Expose()
  channelIds?: string[];
}
